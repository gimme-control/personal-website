document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadBooks();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.section');

    function cleanPath() {
        return window.location.pathname.replace(/\/index\.html$/, '/') || '/';
    }

    function setSectionUrl(targetId) {
        const path = cleanPath();
        const url = targetId === 'home' ? path : `${path}#${targetId}`;
        history.replaceState(null, '', url);
    }

    function activateSection(targetId, updateUrl = true) {
        if (![...sections].some(s => s.id === targetId)) {
            targetId = 'home';
        }

        navLinks.forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('href') === `#${targetId}`) {
                l.classList.add('active');
            }
        });

        sections.forEach(s => {
            s.classList.remove('active');
            if (s.id === targetId) {
                s.classList.add('active');
            }
        });

        if (updateUrl) setSectionUrl(targetId);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href.startsWith('#')) return;

            e.preventDefault();
            activateSection(href.substring(1));
        });
    });

    window.addEventListener('hashchange', () => {
        const id = window.location.hash.substring(1) || 'home';
        activateSection(id, false);
    });

    // Drop leftover /index.html from the address bar
    if (/\/index\.html$/i.test(window.location.pathname)) {
        history.replaceState(null, '', cleanPath() + window.location.hash);
    }

    const hash = window.location.hash;
    if (hash.startsWith('#')) {
        activateSection(hash.substring(1), false);
    }
}

function loadBooks() {
    const container = document.getElementById('books-container');
    if (!container) return;

    if (typeof booksData === 'undefined' || !Array.isArray(booksData)) {
        console.error('booksData is missing');
        container.innerHTML = '<p>Unable to load bookshelf data.</p>';
        return;
    }

    if (booksData.length === 0) {
        container.innerHTML = '<p>No books currently on the shelf.</p>';
        return;
    }

    container.innerHTML = `<div class="books-grid">${booksData.map(createBookCardHTML).join('')}</div>`;

    container.querySelectorAll('.book-cover').forEach((img, index) => {
        bindCover(img, booksData[index]);
    });
}

function coverSources(book) {
    const isbn = String(book.isbn || '').replace(/[-\s]/g, '');
    if (!isbn) return [];

    return [
        `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`,
        `https://books.google.com/books/content?vid=ISBN${isbn}&printsec=frontcover&img=1&zoom=1`
    ];
}

function bindCover(img, book) {
    const sources = coverSources(book);
    let i = 0;
    let settled = false;

    const fallback = () => {
        if (settled) return;
        settled = true;
        img.src = titleCoverSvg(book);
    };

    const next = () => {
        if (settled) return;
        i += 1;
        if (i >= sources.length) {
            fallback();
            return;
        }
        img.src = sources[i];
    };

    img.addEventListener('error', next);
    img.addEventListener('load', () => {
        if (settled) return;
        if (img.naturalWidth < 20) {
            next();
            return;
        }
        settled = true;
    });

    // innerHTML can finish (or fail) the request before listeners attach
    if (img.complete && !settled) {
        if (img.naturalWidth < 20) next();
        else settled = true;
    }
}

function wrapTitle(title, maxChars = 16, maxLines = 7) {
    const words = String(title).split(/\s+/);
    const lines = [];
    let current = '';

    for (const word of words) {
        const trial = current ? `${current} ${word}` : word;
        if (trial.length > maxChars && current) {
            lines.push(current);
            current = word;
            if (lines.length === maxLines) {
                current = '';
                break;
            }
        } else {
            current = trial;
        }
    }
    if (current && lines.length < maxLines) lines.push(current);
    return lines;
}

function titleCoverSvg(book) {
    const lines = wrapTitle(book.title || 'Untitled');
    const startY = 150 - ((lines.length - 1) * 18) / 2;
    const text = lines.map((line, idx) => {
        const y = startY + idx * 18;
        return `<text x="100" y="${y}" text-anchor="middle" fill="#e0e0e0" font-size="13" font-family="-apple-system,BlinkMacSystemFont,sans-serif">${escapeHtml(line)}</text>`;
    }).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="200" height="300" fill="#1e1e1e"/>${text}</svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function createBookCardHTML(book) {
    const title = escapeHtml(book.title);
    const author = escapeHtml(book.author);
    const review = book.review ? `"${escapeHtml(book.review)}"` : '';
    const src = escapeHtml(coverSources(book)[0] || titleCoverSvg(book));

    return `
        <div class="book-card">
            <img src="${src}" alt="${title}" class="book-cover" referrerpolicy="no-referrer">
            <div class="book-overlay">
                <h3>${title}</h3>
                <p>${author}</p>
                <div class="review-text">${review}</div>
            </div>
        </div>
    `;
}

