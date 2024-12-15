const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const USER_SAFE_INFO = [
    'firstName',
    'LastName',
    'photoUrl',
    'age',
    'about',
    'skills',
];

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const self = req.user;

        const pendingRequests = await ConnectionRequest.find({
            toUserId: self._id,
            status: 'interested',
        }).populate('fromUserId', USER_SAFE_INFO);

        res.status(200).json({
            data: pendingRequests,
        });
    } catch (err) {
        res.status(400).send(`Error: ${err.message}`);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const self = req.user;

        const connections = await ConnectionRequest.find({
            status: 'accepted',
            $or: [{ fromUserId: self._id }, { toUserId: self._id }],
        })
            .populate('fromUserId', USER_SAFE_INFO)
            .populate('toUserId', USER_SAFE_INFO);

        const myConnections = connections.map((conn) => {
            if (conn.fromUserId._id.equals(self._id)) {
                return conn.toUserId;
            }

            return conn.fromUserId;
        });

        res.send(myConnections);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * TODO: create /user/feeds API
 * ? logged-in user should not see his card in the feeds
 * ? logged-in user should not see the cards of users who are already in his connections
 * ? logged-in user should not see the cards of users who he already ignored OR declined requests
 */

userRouter.get('/user/feeds', userAuth, async (req, res) => {
    try {
        const self = req.user;
        
        // pagination
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const page = parent(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const requests = await ConnectionRequest.find({
            $or: [{ fromUserId: self._id }, { toUserId: self._id }],
        }).select(['fromUserId', 'toUserId']);

        const hideFeedsFor =  new Set();
        requests.forEach((row) => {
            hideFeedsFor.add(row.fromUserId.toString());
            hideFeedsFor.add(row.toUserId.toString());
        });

        const userFeeds = await User.find({
            $and: [
                {
                    _id: { $nin: Array.from(hideFeedsFor) },
                },
                {
                    _id: { $ne: self._id },
                },
            ],
        })
            .select(USER_SAFE_INFO)
            .skip(skip)
            .limit(limit);

        res.json({
            data: userFeeds,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = userRouter;
