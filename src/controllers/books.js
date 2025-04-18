import express from 'express'
import Books from '../models/Books.js';

const books = express.Router()


books.get('/', async (req, res) => {
    const books = await Books.find({})
    console.log(books)
    return res.render('all-books', { books });
})

books.get('/add-book', async (req, res) => {
    const lastBook = await Books.findOne().sort({ISBN: -1})
    const nextISBN = lastBook ? parseInt(lastBook.ISBN) + 1 : 100001
    return res.render('add-book', {userData: req.session.user, nextISBN});
})

books.get('/my-books', async (req, res) => {
    const books = await Books.find({author: req.session.user?.name})
    return res.render('my-book', {books});
})


books.get('/book/:isbn', async (req, res) => {
    const {isbn} = req.params
    const bookDetails = await Books.findOne({ISBN: isbn})
    return res.render('book-details', {userData: req.session.user, bookDetails});
})

books.post('/add-book', async (req, res) => {
    const { title, author, desc } = req.body
    const lastBook = await Books.findOne().sort({ISBN: -1})
    const isbn = lastBook ? parseInt(lastBook.ISBN) + 1 : 100001
    if (!title || !author || !desc || !isbn) return res.status(400).json({ message: 'Please fill all fields.' })
    const isBook = await Books.findOne({ $or: [{ title: title }, { ISBN: isbn }] })
    if (isBook) return res.status(400).json({ message: 'The book already registered. Please add another book' })
    const newBook = new Books({
        title: title,
        author: author,
        description: desc,
        ISBN: isbn
    })
    await newBook.save()
    return res.status(201).json({
        message: 'Book added successfully.', 
        redirect: '/books/my-books'
    })
})

books.post('/update-book', async (req, res) => {
    const { title, desc, isbn } = req.body;

    try {
        const book = await Books.findOne({ ISBN: isbn });

        if (!book) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        if (title) book.title = title;
        if (desc) book.description = desc;

        await book.save();

        return res.status(200).json({
            message: 'Book updated successfully.',
            redirect: '/books/my-books'
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


export default books