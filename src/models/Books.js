import mongoose from 'mongoose'

const bookSchema = mongoose.Schema({
    title: {type: String, required: true, min: 3, unique: true},
    author: {type: String, required: true},
    description: {type: String, required: true, min: 3},
    ISBN: {type: Number, required: true, min: 3, unique: true}
}, {timestamps: true});

const Books = mongoose.model('Book', bookSchema)

export default Books 