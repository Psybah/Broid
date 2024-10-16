const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const User = require('./models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGODB_URL);

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'agawerhga';

// Routes
const userRoutes = require('./routes/userRoutes');
const imageUploadRoutes = require('./routes/imageUploadRoutes');
const embroideryRoutes = require('./routes/embroideryRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173',
    })
);
app.options('*', cors());
app.use('/images', express.static(path.join(__dirname, '/images')));

app.use('/', userRoutes);
app.use('/', imageUploadRoutes);
app.use('/', embroideryRoutes);
app.use('/', bookingRoutes);

// test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign(
                {
                    email: userDoc.email,
                    id: userDoc._id,
                },
                jwtSecret,
                {},
                (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(userDoc);
                }
            );
        } else {
            res.status(422).json('pass not ok');
        }
    } else {
        res.json('not found');
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id);
            res.json({ name, email, _id });
        });
    } else {
        res.json(null);
    }
    res.json({ token });
});

app.listen(PORT, () => {
    console.log('Server running on port 4000');
});
