const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const BLOG_DIR = path.join(ROOT, 'blog');

// Add posts as markdown in /posts, named YYYY-MM-DD-slug.md:
// ---
// title: My post
// date: 2026-08-26
// ---
//
// Markdown body here. Run `./dev.sh` or push; CI rebuilds blog/.

marked.setOptions({
    gfm: true,
    breaks: false,
});

function parseFrontmatter(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) {
        return { meta: {}, body: content.trim() };
    }

    const meta = {};
    for (const line of match[1].split('\n')) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim();
        if (key) meta[key] = value;
    }

    return { meta, body: match[2].trim() };
}

function slugFromFilename(filename) {
    return path.basename(filename, '.md');
}

function formatDate(dateStr) {
    const date = new Date(`${dateStr}T12:00:00`);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function pageShell({ title, body, navLabel = 'Blog' }) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <div class="container">
        <nav class="blog-nav">
            <a href="../">Home</a>
            <a href="./">${navLabel}</a>
            <a href="../#bookshelf">Bookshelf</a>
        </nav>
        ${body}
    </div>
    <footer>
        <div class="footer-content">
            <div class="social-links">
                <a href="https://github.com/gimme-control" aria-label="GitHub"><i class="fab fa-github"></i></a>
                <a href="https://www.youtube.com/@ezclap0379" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
            </div>
            <div>© 2026 Harisai Karthikeyan</div>
        </div>
    </footer>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</body>
</html>`;
}

function loadPosts() {
    if (!fs.existsSync(POSTS_DIR)) {
        fs.mkdirSync(POSTS_DIR, { recursive: true });
        return [];
    }

    return fs.readdirSync(POSTS_DIR)
        .filter((file) => file.endsWith('.md'))
        .map((file) => {
            const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
            const { meta, body } = parseFrontmatter(raw);
            const slug = slugFromFilename(file);
            const title = meta.title || slug.replace(/-/g, ' ');
            const date = meta.date || slug.slice(0, 10);

            return {
                slug,
                title,
                date,
                html: marked.parse(body),
            };
        })
        .sort((a, b) => b.date.localeCompare(a.date));
}

function writePostPages(posts) {
    if (!fs.existsSync(BLOG_DIR)) {
        fs.mkdirSync(BLOG_DIR, { recursive: true });
    }

    const keep = new Set(posts.map((post) => `${post.slug}.html`));
    keep.add('index.html');
    for (const file of fs.readdirSync(BLOG_DIR)) {
        if (file.endsWith('.html') && !keep.has(file)) {
            fs.unlinkSync(path.join(BLOG_DIR, file));
        }
    }

    for (const post of posts) {
        const body = `
        <article class="blog-post">
            <h1>${escapeHtml(post.title)}</h1>
            <p class="blog-meta">${escapeHtml(formatDate(post.date))}</p>
            <div class="blog-content">${post.html}</div>
        </article>`;

        fs.writeFileSync(
            path.join(BLOG_DIR, `${post.slug}.html`),
            pageShell({ title: post.title, body })
        );
    }
}

function writeIndexPage(posts) {
    const listItems = posts.length === 0
        ? '<p class="blog-empty">No posts yet.</p>'
        : `<ul class="blog-list">${posts.map((post) => `
            <li>
                <a href="${post.slug}.html">${escapeHtml(post.title)}</a>
                <span class="blog-date">${escapeHtml(formatDate(post.date))}</span>
            </li>`).join('')}
        </ul>`;

    const body = `
        <section class="blog-index">
            <h1>Blog</h1>
            ${listItems}
        </section>`;

    fs.writeFileSync(
        path.join(BLOG_DIR, 'index.html'),
        pageShell({ title: 'Blog', body, navLabel: 'Blog' })
    );
}

function main() {
    const posts = loadPosts();
    writePostPages(posts);
    writeIndexPage(posts);
    console.log(`Built ${posts.length} post${posts.length === 1 ? '' : 's'}.`);
}

main();
