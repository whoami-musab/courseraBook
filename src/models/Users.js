import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name: {type: String, required: true, min: 3},
    email: {type: String, required: true, min: 4},
    password: {type: String, required: true, min: 3}
});

const Users = mongoose.model('User', userSchema)

export default Users 