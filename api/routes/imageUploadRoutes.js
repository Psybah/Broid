const express = require('express');
const { uploadPhotos, uploadImageUsingLink } = require('../controllers/imageController');
const multer = require("multer");

const imageUploadRouter = express.Router();
const imageMiddleware = multer({ dest: 'uploads/' });

imageUploadRouter.post('/upload-using-link', uploadImageUsingLink);
imageUploadRouter.post('/upload', imageMiddleware.array('file', 100), uploadPhotos);

module.exports = imageUploadRouter;