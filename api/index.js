const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs/dist/bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { encryptPassword, checkedPassword } = require('./utils');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

// Enables cors for all routes and pre-flight
app.use(cors());
app.options('*', cors());

mongoose.connect(process.env.MONGODB_URL);

// test route
app.get('/test', (request, response) => {
    response.json('test ok');
});

// register user route
app.post('/register', async (request, response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
        return response
            .status(400)
            .json({ error: 'Name, email and password required' });
    }

    try {
        const newUser = await User.create({
            name,
            email,
            password: encryptPassword(password),
        });

        response.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        response.status(422).json({ error: error.message });
    }
});

// login endpoint
app.post('/login', async (request, response) => {
    const { email, password } = request.body;
    const user = await User.findOne({ email });

    if (user) {
        const isValidPassword = encryptPassword(password) === user.password;
        const passwordIsOkay = checkedPassword(password, user.password);

        if (isValidPassword && passwordIsOkay) {
            jwt.sign(
                { id: user._id, email: user.email, name: user.name },
                process.env.JWT_SECRET_KEY,
                {},
                (error, token) => {
                    if (error) throw error;
                    response
                        .cookie('token', token)
                        .json({ 'Logged in as: ': user.email });
                }
            );
        } else {
            response.status(401).json({ error: 'Invalid password' });
        }
    } else {
        response.status(404).json({ error: 'User not found' });
    }
});

// user profile endpoint
app.get('/profile', (request, response) => {
    const token = request.cookies.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
            if (error) {
                response.status(401).json({ error: 'Invalid token' });
            } else {
                const userId = decoded.id;
                User.findById(userId, (error, user) => {
                    if (error) {
                        response.status(404).json({ error: 'User not found' });
                    } else {
                        response.status(200).json(user);
                    }
                });
            }
        });
    } else {
        response.status(401).json({ error: 'No token provided' });
    }
});

app.listen(PORT, () => {
    console.log(process.env.MONGODB_URL);
    console.log(`Server running on ${PORT}`);
});
