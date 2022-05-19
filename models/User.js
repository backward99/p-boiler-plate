const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlangth: 50
    },email: {
        type: String,
        trim: true,
        uniqeu: 1
    },password: {
        type: String,
        mixlangth: 4
    },lastname: {
        type: String,
        maxlangth: 50
    },role: {
        type: Number,
        default: 0
    },image: {
        type: String
    },token: {
        type: String,
    },tokenExo: {
        type: Number,
    },
})

const User = mongoose.model('User', userSchema);

module.exports = { User };