// This file allows you to add/remove books from your bookshelf.
// Provide the title, author, year, and a short review.
// Images will be fetched dynamically using the ISBN.

const booksData = [
    // --- READ ---
    {
        "title": "House of Huawei",
        "author": "Eva Dou",
        "isbn": "9780593544631",
        "review": "renzhengfei is smth else. huawei prolly more relevant in the chip war now and they also building their own fab.",
        "rating": 5
    },
    {
        "title": "1984",
        "author": "George Orwell",
        "isbn": "9780141187761",
        "review": "first orwell book, loved it. ending was crazy though. 'not acting, but genuinely loving big brother.'",
        "rating": 5
    },
    {
        "title": "Elon Musk",
        "author": "Walter Isaacson",
        "isbn": "9781982181284",
        "review": "fire book, elons management strategy and stuff regarding starlink and ukraine was quite interesting.",
        "rating": 5
    },
    {
        "title": "Exit, Voice, and Loyalty",
        "author": "Albert O. Hirschman",
        "isbn": "9780674276604",
        "review": "really good book, love the idea of exit and made me wonder what society would look like without any barriers to exit.",
        "rating": 5
    },

    {
        "title": "Apple in China",
        "author": "Patrick McGee",
        "isbn": "9781668053379",
        "review": "apple thought they were getting a steal when their vendors in china were giving them the deal of the century by taking on all the risk. little did they know...",
        "rating": 5
    },

    // --- CURRENTLY READING ---
    {
        "title": "Only the Paranoid Survive",
        "author": "Andrew S. Grove",
        "isbn": "9780385483827",
        "review": "Currently Reading",
        "rating": null
    },
    {
        "title": "Start-up Nation",
        "author": "Dan Senor & Saul Singer",
        "isbn": "9780446541466",
        "review": "Currently Reading",
        "rating": null
    },
    {
        "title": "Who Knew?",
        "author": "Barry Diller",
        "isbn": "9781668096871",
        "review": "Currently Reading",
        "rating": null
    },
    {
        "title": "Zero to One",
        "author": "Peter Thiel & Blake Masters",
        "isbn": "9780804139298",
        "review": "Currently Reading",
        "rating": null
    },
    {
        "title": "The Philosopher in the Valley",
        "author": "Michael Steinberger",
        "isbn": "9781668012956",
        "review": "Currently Reading",
        "rating": null
    },
    {
        "title": "Deng Xiaoping and the Transformation of China",
        "author": "Ezra F. Vogel",
        "isbn": "9780674055445",
        "review": "Currently Reading",
        "rating": null
    },
    {
        "title": "The Art of Living",
        "author": "Epictetus",
        "isbn": "9780061286056",
        "review": "Currently Reading",
        "rating": null
    },
    {
        "title": "Flash Boys",
        "author": "Michael Lewis",
        "isbn": "9780393244663",
        "review": "Currently Reading",
        "rating": null
    },
    {
        "title": "Chaos Monkeys",
        "author": "Antonio García Martínez",
        "isbn": "9780062458193",
        "review": "Currently Reading",
        "rating": null
    }
];
