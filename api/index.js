const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGODB_URL);

// Routes
const userRoutes = require('./routes/userRoutes');
const imageUploadRoutes = require('./routes/imageUploadRoutes')

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.options('*', cors());
app.use('/images', express.static(path.join(__dirname, '/images')));


app.use('/', userRoutes);
app.use('/', imageUploadRoutes);

// test route
app.get('/test', (request, response) => {
    response.json('test ok');
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
