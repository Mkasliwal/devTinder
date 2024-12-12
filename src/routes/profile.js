const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send({
            message: `✨ Hello, Welcome ${user.firstName}`,
            data: user,
        });
    } catch (err) {
        res.status(400).send(`⚠️ Error: ${err.message}`);
    }
});

profileRouter.post('/profile/edit', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const body = req.body;
        validateProfileEditFields(body);

        Object.keys(body).forEach((key) => user[key] = body[key]);
        await user.save();
        res.send({
            message: "✨ Data Updated Succeessfully",
            data: user
        });
    } catch (err) {
        res.status(400).send(`⚠️ Error: ${err.message}`);
    }
});

module.exports = profileRouter;
