const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// constants
const PRIVATE_KEY = 'd3vTind3r@express';

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

const userMethods = userSchema.methods;

userMethods.signToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user.password}, PRIVATE_KEY, {expiresIn: '1d'});
    return token;
};

userMethods.validatePassword = async function (userPasswordInput) {
    const user = this;
    const match = await bcrypt.compare(userPasswordInput, user.password);

    if(!match) {
        throw Error('Password is Invalid');
    }
}



const User = mongoose.model('User', userSchema);

module.exports = User;