// deps
const express = require('express');
const connectDb = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('../src/routes/auth');
const profileRouter = require('../src/routes/profile');
const connectionRequestRouter = require('../src/routes/connectionRequests');
const userRouter = require('./routes/user');

const app = express();
const PORT = 29000;
const HOST = '0.0.0.0';

// middlewares
app.use(express.json());
app.use(cookieParser());

// bind routes
app.use('/', authRouter, profileRouter, connectionRequestRouter, userRouter);

// connect to a database
connectDb()
    .then(() => {
        console.log('Connection Established....');

        app.listen(PORT, HOST, () => {
            console.log(`ooOOoo 🟢 Server is listening on PORT ${PORT} ooOOoo`);
        });
    })
    .catch((err) => console.log(err));
