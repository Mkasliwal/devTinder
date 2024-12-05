const validator = require('validator');

const validateSignUpReq = (req) => {
    const { firstName, lastName, email, password } = req;

    if(!firstName || !lastName) {
        throw new Error('Please enter first name and last name!');
    }
    if(!validator.isEmail(email)) {
        throw new Error('Invalid email address!');
    }
    if(!validator.isStrongPassword(password)) {
        throw new Error('Password is weak. Please enter strong password!');
    }
}

const validateLogin = (req) => {
    const { email, password } = req;

    if(!validator.isEmail(email)) {
        throw new Error('Please enter valid email address!');
    }
    if(!password || password == '') {
        throw new Error('Please enter password!');
    }
}

module.exports = {
    validateSignUpReq,
    validateLogin
}