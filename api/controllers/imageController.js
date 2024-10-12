const fs = require('fs');
const path = require('path');
const imageDownloader = require('image-downloader');

// upload embroidery photo using link
const uploadImageUsingLink = async (request, response) => {
    if (request.cookies.token) {
        if ('link' in request.body) {
            const { link } = request.body;
            const photoName = 'photo' + Date.now() + '.jpg';

            const imagesDir = path.join(__dirname, '../images/');

            // Ensure images directory exists
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
}

// upload photos
const uploadPhotos = (request, response) => {
    if (!request.files) return response.status(400).json({error: 'Invalid request'});

    const uploadedFiles = [];
    for (let iterator = 0; iterator < request.files.length; iterator++) {
        const {path, originalName} = request.files[iterator];
        const photoNameSplit = originalName.split('.');
        const extension = photoNameSplit[photoNameSplit.length - 1];
        const newPath = path + '.' + extension;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/', ''));
    }
    response.status(200).json(request.files);
}

module.exports = {uploadImageUsingLink, uploadPhotos};
