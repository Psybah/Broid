const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const multer = require('multer');
const { encryptPassword, checkPassword } = require('./utils');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use('/images', express.static(path.join(__dirname, '/images')));

// Enables cors for all routes and pre-flight
app.use(cors());
// app.options('*', cors());

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

// login route
app.post('/login', async (request, response) => {
    const { email, password } = request.body;

    if (!email || !password)
        return response
            .status(400)
            .json({ error: 'Email and password required' });

    try {
        const user = await User.findOne({ email });

        if (user) {
            const isValidPassword = checkPassword(password, user.password);

            if (isValidPassword) {
                jwt.sign(
                    { id: user._id, email: user.email, name: user.name },
                    process.env.JWT_SECRET_KEY,
                    {},
                    (error, token) => {
                        if (error) throw error;
                        response.cookie('token', token).json({
                            'Logged in as: ': user.email,
                            token: token,
                        });
                    }
                );
            } else {
                response.status(401).json({ error: 'Invalid password' });
            }
        } else {
            response.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

// user profile endpoint
app.get('/profile', async (request, response) => {
    const token = request.cookies.token;
    if (token) {
        try {
            const decodedPassword = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );
            const userId = decodedPassword.id;

            const user = await User.findById(userId);

            if (!user)
                return response.status(404).json({ error: 'User not found' });

            response.status(200).json(user);
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                response.status(401).json({ error: 'Invalid token' });
            } else {
                response.status(500).json({ error: error.message });
            }
        }
    } else {
        response.status(401).json({ error: 'No token provided' });
    }
});

// upload photo using link
app.post('/upload-using-link', async (request, response) => {
    if (request.cookies.token) {
        if ('link' in request.body) {
            const { link } = request.body;
            const photoName = 'photo' + Date.now() + '.jpg';

            //? Ensure images directory exists
            const imagesDir = path.join(__dirname, '/images/');
            if (!fs.existsSync(imagesDir)) {
                fs.mkdirSync(imagesDir, { recursive: true });
            }

            try {
                await imageDownloader.image({
                    url: link,
                    dest: path.join(imagesDir, photoName),
                });

                response.status(200).json({ photo: photoName });
            } catch (error) {
                response.status(500).json({ error: error.message });
            }
        } else {
            response.status(400).json({ error: 'No link provided' });
        }
    } else {
        response.status(401).json({ error: 'Invalid token' });
    }
});

const imageMiddleware = multer({dest: 'images'});

app.post('/upload', (request, response) => {

});

// upload photo directly
app.post('/upload-it', (request, response) => {
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
                        user.photos.push(request.body.url);
                        user.save();
                        response.status(200).json(user);
                    }
                });
            }
        });
    } else {
        response.status(401).json({ error: 'No token provided' });
    }
});

// app.post('/')

// logout route
app.post('/logout', (request, response) => {
    response.clearCookie('token').json({ message: 'Logged out' });
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
