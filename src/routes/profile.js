const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateProfileEditFields } = require('../utils/validators');

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const self = req.user;
        res.send({
            message: `✨ Hello, Welcome ${self.firstName}`,
            data: self,
        });
    } catch (err) {
        res.status(400).send(`⚠️ Error: ${err.message}`);
    }
});

profileRouter.post('/profile/edit', userAuth, async (req, res) => {
    try {
        const self = req.user;
        const body = req.body;
        validateProfileEditFields(body);

        Object.keys(body).forEach((key) => self[key] = body[key]);
        await self.save();
        res.send({
            message: "✨ Data Updated Succeessfully",
            data: self
        });
    } catch (err) {
        res.status(400).send(`⚠️ Error: ${err.message}`);
    }
});

module.exports = profileRouter;
