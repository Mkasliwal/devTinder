// deps
const express = require('express');
const connectDb = require('./config/database');
const User = require('./models/user');
const { validateSignUpReq, validateLogin } = require('./utils/validators');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const PRIVATE_KEY = 'd3vTind3r@express'

const app = express();
const PORT = 29000;
const HOST = '0.0.0.0';

// middlewares
app.use(express.json());
app.use(cookieParser());

// app routes
// Register a user
app.post('/signup', async (req, res) => {
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
        res.send("Data is stored successfully");
        console.log(`User is successfully registered with id: ${_id}`);
    } catch(err) {
        res.status(404).send(`ERROR: ${err}`);
    }
});

// login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        validateLogin({ email, password });
        
        const registeredUser = await User.findOne({ email });

        if(!registeredUser) {
            throw new Error('Invalid credentials');
        }

        const match = await bcrypt.compare(password, registeredUser.password);
        if(!match) {
            throw new Error('Invalid credentials');
        }

        // sign jwt
        const token = jwt.sign({ _id: registeredUser.id }, PRIVATE_KEY);

        res.cookie('token', token);
        res.send(`Hey ${registeredUser.firstName}, Welcome to devTinder 🧑🏾‍💻✨`);
    } catch(err) {
        res.status(404).send(`ERROR: ${err}`);
    }
});

app.get('/profile', async (req, res) => {   
    try {
        const cookies = req.cookies;
        const { token } = cookies;

        const verifideToken = jwt.verify(token, PRIVATE_KEY);
        const { _id } = verifideToken;

        const user = await User.findOne({_id});
        if(user) {
            res.send(`Hello, Welcome ${user.name}`);
        } else {
            res.status(404).send(`Error: User not found`);
        }
    } catch (err) {
        console.log(err);
        res.status(403).send(`Error: ${err}`);
    }
});

// GET a user with a filter
app.get('/user', async (req, res) => {
    const filter = { email: "mayurkasliwal97@gmail.com"};

    try {
        const users = await User.find(filter);
        res.send(users);
    } catch(err) {
        res.status(404).send("Unable to get the Users :/");
    }
});

// GET a user by id
app.get('/user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        res.send(user);
    } catch(err) {
        res.status(404).send("Unable to get a User:/");
    }
});

// GET all users
app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(err) {
        res.status(404).send("Unable to get Users :/");
    }
});

// DELETE a user by id
app.delete('/user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
        res.send('User deleted from Database successfully');
    } catch (err) {
        res.send(404).send('Unable to delete the User :/');
    }
});

// UPDATE a user by id
app.patch('/user/:id', async (req, res) => {
    const id = req.params?.id;
    const body = req.body;

    try {
            const ALLOWED_UPDATES = [
                "about", "age", "skills", "photoUrl", "gender"
            ];
        
            const isUpdateAllowed = Object.keys(body).every((k) => ALLOWED_UPDATES.includes(k));
        
            if(!isUpdateAllowed) {
                throw new Error("Foriegn properties found in body.");
            }
        
            // init
            await User.findByIdAndUpdate(id, body, { runValidators: true });
            res.send("Successfully updated the field :)");
    } catch(err) {
        res.status(400).send("Unable to update field :/. " + err);
    }
});

// connect to a database
connectDb()
    .then(() => {
        console.log('Connection Established....');

        app.listen(PORT, HOST, () => {
            console.log(`ooOOoo 🟢 Server is listening on PORT ${PORT} ooOOoo`);
        });
    })
    .catch(err => console.log(err));
