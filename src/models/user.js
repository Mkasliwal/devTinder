const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2
    },
    lastName: {
        type: String,
        required: false,
        trim: true,
        minLength: 2
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid Email Address!')
            }
        } 
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error('Password is weak strong!')
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
    },
    photoUrl: {
        type: String,
        default: "https://img.freepik.com/premium-vector/free-vector-user-icon-simple-line_901408-588.jpg",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error('Invalid URL!')
            }
        }
    },
    skills: {
        type: [String]
    },
    about: {
        type: String,
        default: "This is a default description of a user..."
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;