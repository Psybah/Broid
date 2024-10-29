const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const axios = require('axios');
const imageDownloader = require('image-downloader');
const { getUserDataFromToken } = require('../utils');

/**
 * @function uploadImageUsingLink
 * @desc Downloads an image from a given URL and saves it to the server's filesystem.
 * @param {object} request - Express request object, expects `link` (image URL) in `request.body`.
 * @param {object} response - Express response object.
 */
const uploadImageUsingLink = async (request, response) => {
    // Extract the image URL from the request body
    const { link } = request.body;

    // Generate a unique name for the image file
    const newName = 'photo' + Date.now() + '.jpg';
    
    // Determine where to save the image
    const destinationPath = path.join(__dirname, '../uploads/', newName);

    // Ensure the directory exists, creating it if necessary
    fsExtra.ensureDirSync(path.dirname(destinationPath));
    console.log(newName);

    try {
        // Use image-downloader to download the image from the provided URL
        const downloadedImage = await imageDownloader.image({
            url: link,
            dest: destinationPath,  // Save path for the downloaded image
        });

        console.log('Image downloaded:', downloadedImage);
        console.log(newName);

        // Respond with the filename if download is successful
        response.json(newName);
    } catch (error) {
        // Log and handle download errors, such as network issues or invalid URLs
        console.error('Error downloading image:', error.message);
        response.status(500).json({
            error: 'Failed to download image',
            message: error.message,
        });
    }
};

/**
 * @function uploadPhotos
 * @desc Handles file uploads by processing multiple images sent in the request and saving them on the server.
 * @param {object} request - Express request object, expects `files` in `request.files` and a valid `token` in cookies.
 * @param {object} response - Express response object.
 */
const uploadPhotos = async (request, response) => {
    // Check if files are included in the request
    if (!request.files)
        return response.status(400).json({ error: 'Please Provide your Broid images' });


    console.log(request.files); // Log the files received in the request for debugging

    const { token } = request.cookies;  // Retrieve the token from request cookies

    if (token) {
        try {
            // _ = getUserDataFromToken(token);

            // Initialize an array to store the paths of successfully uploaded files
            const uploadedFiles = [];

            // Destructure the path and original name of each file in the array
            for (
                let iterator = 0;
                iterator < request.files.length;
                iterator++
            ) {
                const { path, originalname } = request.files[iterator];
                const photoNameSplit = originalname.split('.');
                const extension = photoNameSplit[photoNameSplit.length - 1];     // Determine the file extension and construct a new path with it
                const newPath = path + '.' + extension;                 // Rename the file to include the extension and move it to the final destination


                // Rename the file to include the extension and move it to the final destination
                fs.renameSync(path, newPath);
                
                // Add the final path to the uploadedFiles array (excluding the `uploads/` prefix for consistency)
                uploadedFiles.push(newPath.replace('uploads/', ''));
            }

            // Send a success response with the list of all uploaded file paths
            response.status(200).json({
                message: 'Photos uploaded successfully',
                photos: uploadedFiles,
            });
        } catch (error) {
            // Check if the error is due to an invalid token and respond accordingly
            if (error.name === 'JsonWebTokenError') {
                response.status(401).json({ error: 'Invalid token' });
            } else {
                // Catch any other server error and respond with a 500 status code
                response.status(500).json({ error: error.message });
            }
        }
    } else {
        // If the token is missing, respond with an unauthorized error
        response.status(401).json({ error: 'No token provided' });
    }
};

module.exports = { uploadImageUsingLink, uploadPhotos };