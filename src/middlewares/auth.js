const jwt = require('jsonwebtoken');
const User = require('../models/user');
const PRIVATE_KEY = 'd3vTind3r@express';

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if(!token) {
            throw Error("Looks like you're not logged in");
        }

        const decodeToken = jwt.verify(token, PRIVATE_KEY);

        const { _id } = decodeToken;
        const user = await User.findOne({ _id });

        if(!user) {
            throw Error('User not found');
        }

        // append the authenticated user in the `request`
        // for APIs to extract the user info
        req.user = user;

        next();
    } catch (err) {
        res.status(400).send(`Error: ${err.message}`);
    }
}

module.exports = { userAuth };