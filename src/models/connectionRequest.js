const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        status: {
            type: String,
            enum: {
                values: ['interested', 'ignored', 'accepted', 'declined'],
                message: '{VALUE} is invalid status type',
            },
            required: true,
        },
    },
    { timestamps: true }
);

connectionRequestSchema.index({
    fromUserId: 1,
    toUserId: 1,
});

const ConnectionRequest = mongoose.model(
    'ConnectionRequest',
    connectionRequestSchema
);

module.exports = ConnectionRequest;
