const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const axios = require('axios');
const { getUserDataFromToken } = require('../utils');

// upload embroidery photo using link
const uploadImageUsingLink = async (request, response) => {
    if (request.cookies.token) {
        if (!getUserDataFromToken(request.cookies.token))
            return response.status(401).json({ error: 'Invalid token' });

        if ('link' in request.body) {
            const { link } = request.body;

            const photoName = 'photo' + Date.now() + '.jpg';
            const imagesDir = path.join(__dirname, '../images/');

            // Ensure images directory exists
            fsExtra.ensureDirSync(imagesDir);

            try {
                const axiosResponse = await axios({
                    method: 'get',
                    url: link,
                    responseType: 'stream',
                });

                // Define the path to save the image
                const destinationPath = path.join(imagesDir, photoName);

                const writer = fs.createWriteStream(destinationPath);
                axiosResponse.data.pipe(writer);

                writer.on('finish', () => {
                    response.status(200).json({
                        message: 'Image uploaded successfully',
                        path: destinationPath,
                    });
                });

                writer.on('error', (error) => {
                    response.status(500).json({
                        message: 'Error writing image file',
                        error: error.message,
                    });
                });
            } catch (error) {
                response.status(500).json({
                    message: 'Failed to download image',
                    error: error.message,
                });
            }
        } else {
            response.status(400).json({ error: 'Image URL is required' });
        }
    } else {
        response.status(401).json({ error: 'No token provided' });
    }
};

// upload photos
const uploadPhotos = async (request, response) => {
    if (!request.files)
        return response.status(400).json({ error: 'Invalid request' });

    const { token } = request.cookies;

    if (token) {
        try {
            _ = getUserDataFromToken(token);

            const uploadedFiles = [];

            for (
                let iterator = 0;
                iterator < request.files.length;
                iterator++
            ) {
                const { path, originalName } = request.files[iterator];
                const photoNameSplit = originalName.split('.');
                const extension = photoNameSplit[photoNameSplit.length - 1];
                const newPath = path + '.' + extension;

                // Rename the file
                fs.renameSync(path, newPath);
                uploadedFiles.push(newPath.replace('uploads/', '')); // Append to uploaded files list
            }
            response.status(200).json({
                message: 'Photos uploaded successfully',
                photos: request.files,
            });
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
};

module.exports = { uploadImageUsingLink, uploadPhotos };
