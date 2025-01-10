const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}`);;
}

module.exports = connectDb;
