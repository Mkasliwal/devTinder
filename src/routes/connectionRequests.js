const express = require('express');
const connectionRequestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

connectionRequestRouter.post(
    '/request/:status/:toUserId',
    userAuth,
    async (req, res) => {
        try {
            const { status, toUserId } = req.params;
            const fromUserId = req.user._id;

            // toUser Exists?
            const toUser = await User.findById(toUserId);
            if (!toUser) {
                throw Error(`User does not exists!`);
            }

            // toUserId != fromUserId
            if (toUser._id.equals(fromUserId)) {
                throw Error(`Can not send request to yourself!`);
            }

            // if request already exists
            const isRequestExists = await ConnectionRequest.find({
                $or: [
                    {
                        toUserId: fromUserId,
                    },
                    {
                        fromUserId: toUserId,
                    },
                ],
            });

            if (isRequestExists) {
                throw Error('Request already exists!');
            }

            const request = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });

            await request.save();
            res.send('connection request has been sent');
        } catch (err) {
            res.status(400).send(`Error: ${err.message}`);
        }
    }
);

module.exports = connectionRequestRouter;
