import express from 'express'
import Users from '../models/Users.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const users = express.Router()

// Login --------------------------------------------------------------------

users.get('/login', async (req, res) => {
    if (!req.session.user) return res.render('login');
    return res.redirect('/')
})

users.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Please fill all fields.' })
        } 
        const user = await Users.findOne({ $or: [{name: username}, {email: username}] })
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password.' })
        }
        const isPassMatch = await bcrypt.compare(password, user.password)
        if (!isPassMatch) {
            return res.status(400).json({ message: 'Invalid username or password.' })
        }
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.SECRET, 
            { expiresIn: '10min' }
        )
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            token: token
        }
        return res.status(200).json({ 
            message: 'Login Successfully.', 
            userData: req.session.user, 
            redirect: '/' 
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error. Please try again.' })
    }
})

// Register --------------------------------------------------------------------

users.get('/register', (req, res) => {
    if (req.session.user) return res.redirect('/');
    return res.render('register')
})

users.post('/register', async (req, res) => {
    const { name, email, password } = req.body
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all fields.' })
        }
        const user = await Users.findOne({ email })
        if (user) {
            return res.status(400).json({ message: 'Email already registered. Please try with a different one. Please try again' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)

        const newUser = new Users({
            name: name,
            email: email,
            password: hashedPass
        })
        await newUser.save()
        return res.status(200).json({ message: 'Registered Successfully.', redirect: '/users/login' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error. Please try again.' })
    }
})

// Logout --------------------------------------------------------------------

users.get('/logout', (req, res)=>{
    req.session.destroy()
    res.redirect('/users/login')
})

export default users