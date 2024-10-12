const Embroidery = require('../models/Embroidery');
const jwt = require("jsonwebtoken");

// create embroidery object
const createEmbroidery = async (request, response) => {
    if (!request.body) return response.status(400).json({error: 'Input fields empty'});

    const {name, photos, description,
        price, features, extraInfo} = request.body;
    const token = request.cookies.token;
    if (token) {
        try {
            const userData = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );

            if (!userData)
                return response.status(404).json({ error: 'User not found' });

            const embroideryDocument = await Embroidery.create({
                user: userData.id,
                name, photos, description, price, features, extraInfo
            });
            response.status(200).json(embroideryDocument);
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
}

// get a user's embroidery
const getEmbroidery = async (request, response) => {
    const token = request.cookies.token;
    if (token) {
        try {
            const userData = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );

            if (!userData)
                return response.status(404).json({ error: 'User not found' });

            const embroideries = await Embroidery.find({user: userData.id});
            response.status(200).json(embroideryDocument);
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
}

module.exports = {createEmbroidery};
