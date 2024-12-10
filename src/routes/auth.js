const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const { validateSignUpReq, validateLogin } = require('../utils/validators');
const bcrypt = require('bcrypt');

authRouter.post('/signup', async (req, res) => {
    try {
        //* data validation
        validateSignUpReq(req.body);

        const { firstName, lastName, email, password } = req.body;

        //* hash password
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName, lastName, email, password: passwordHash
        });
        const { _id } = await user.save(user);
        res.send("User is stored successfully 😊");
    } catch(err) {
        res.status(404).send(`ERROR: ${err}`);
    }
});

// login
authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;        
        const registeredUser = await User.findOne({ email });

        if(!registeredUser) {
            throw new Error('Invalid credentials');
        }

        await registeredUser.validatePassword(password);

        const token = await registeredUser.signToken();

        res.cookie('token', token);
        res.send({
            message: `Hey ${registeredUser.firstName}, You've logged into devTinder 🔥`,
            data: registeredUser
        });
    } catch(err) {
        res.status(404).send(`ERROR: ${err.message}`);
    }
});

module.exports = authRouter;
