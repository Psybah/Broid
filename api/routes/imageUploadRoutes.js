// Importing necessary modules and controllers
const express = require('express');
const { uploadPhotos, uploadImageUsingLink } = require('../controllers/imageController');
const multer = require("multer");

const imageUploadRouter = express.Router();
const imageMiddleware = multer({ dest: 'uploads/' });

/**
 * @route POST /upload-using-link
 * @desc Upload an image using a link
 * @access Public or Protected
 */
imageUploadRouter.post('/upload-using-link', uploadImageUsingLink);

/**
 * @route POST /upload
 * @desc Upload one or more images
 * @access Public or Protected
 */
imageUploadRouter.post('/upload', imageMiddleware.array('file', 100), uploadPhotos);

module.exports = imageUploadRouter;