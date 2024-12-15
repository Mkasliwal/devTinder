const express = require('express');
const connectionRequestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

connectionRequestRouter.post(
    '/request/send/:status/:toUserId',
    userAuth,
    async (req, res) => {
        try {
            const { status, toUserId } = req.params;
            const fromUserId = req.user._id;

            // check valid status types
            const allowedStatus = ['interested', 'ignored'];
            if (!allowedStatus.includes(status)) {
                throw Error('Invalid request status!');
            }

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
            const isRequestExists = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
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

connectionRequestRouter.post(
    '/request/receive/:status/:requestId',
    userAuth,
    async (req, res) => {
        try {
            const { status, requestId: connectionRequestId } = req.params;
            const loggedInUser = req.user;

            // allowed statuses
            const allowedStatus = ['accepted', 'declined'];
            if (!allowedStatus.includes(status)) {
                throw Error('Invalid status!');
            }

            // request is not found
            const connectionRequest = await ConnectionRequest.findOne({
                _id: connectionRequestId,
                toUserId: loggedInUser._id,
                status: 'interested',
            });

            if (!connectionRequest) {
                throw Error('No connection request exists!');
            }

            connectionRequest.status = status;
            await connectionRequest.save();

            res.status(200).json({
                message: `Request has been ${status}`,
            });
        } catch (err) {
            res.status(404).send(err.message);
        }
    }
);

module.exports = connectionRequestRouter;
