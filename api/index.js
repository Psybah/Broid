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
        origin: true
    })
);
// app.options('*', cors());

// Middleware to add CORS headers to all responses
app.use((req, res, next) => {
    // res.header('Cross-Origin-Resource-Policy', 'same-site')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

app.use('/', userRoutes);
app.use('/', imageUploadRoutes);
app.use('/', embroideryRoutes);
app.use('/', bookingRoutes);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/images', express.static(path.join(__dirname, '/images')));

// test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

app.listen(PORT, () => {
    console.log('Server running on port 4000');
});