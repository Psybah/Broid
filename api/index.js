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
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
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
app.use('/images', express.static(__dirname+'/images'));
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173',
    })
);
app.options('*', cors());
app.use('/images', express.static(path.join(__dirname+'/images')));

// Middleware to add CORS headers to all responses
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use('/', userRoutes);
app.use('/', imageUploadRoutes);
app.use('/', embroideryRoutes);
app.use('/', bookingRoutes);

// test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});


//console.log({__dirname});
//app.post('/upload-using-link'), async (req,res) => {
//const {link} = req.body;
//const newName = 'photo' + Date.now() + '.jpg';
//await imageDownloader.image({
//url: link,
//dest: __dirname + '/images/' +newName,
//});
//res.json(newName);
//}

const photosMiddleware = multer({dest:'images/'});
app.post('/images', photosMiddleware.array('photos', 100), (req,res) => {
    const uploadedFiles = [];
    for (let i=0; i < req.files.length; i++) {
        const {path, originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('images/',''));
    }
    res.json(uploadedFiles);
});

app.listen(PORT, () => {
 console.log('Server running on port 4000');
});
