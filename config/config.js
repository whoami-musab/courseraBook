import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export function connectDB(){
    try{
        mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to DB')
    }catch(err){
        console.log('Failed to connect to DB: ', err.message)
    }
}

export function isLoggedIn(req, res, next){
    if(!req.session.user) return  res.redirect('/users/login');
    next()
}