import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import books from './src/controllers/books.js'
import session from 'express-session'
import { connectDB, isLoggedIn } from './config/config.js'
import { handleError, notFound } from './config/errors.js'
import users from './src/controllers/users.js'
import Books from './src/models/Books.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT
const HOST = process.env.HOST
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(path.join(__filename))


connectDB()

app.set('view engine', 'ejs')

app.set('views', path.join(__dirname, 'src', 'views'))


app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(cors())

app.use(async (req, res, next) => {
    res.locals.Books = await Books.find({})
    res.locals.user = req.session.user || null;   // Pass user to all views
    next();
});

app.get('/', (req, res)=>{
    return res.render('index')
})

// Books Route
app.use('/books', isLoggedIn, books)
app.use('/users', users)

app.use(notFound)
app.use(handleError)

app.listen(PORT, ()=>{
    console.log(`Server running on ${HOST}:${PORT}`)
})