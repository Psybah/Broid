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

// get a user's embroideries
const getUserEmbroideries = async (request, response) => {
    const token = request.cookies.token;
    if (token) {
        try {
            const userData = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );

            if (!userData)
                return response.status(404).json({ error: 'User not found' });

            const embroideryDocument = await Embroidery.find({user: userData.id});
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

// get an embroidery by id
const getEmbroideryById = async (request, response) => {
    const {id} = request.params;

    if (id) {
        try {
            const foundEmbroidery = await Embroidery.findById(id);
            response.status(200).json(foundEmbroidery);
        } catch (error) {
            response.status(400).json({error: "Embroidery does not exist"})
        }
    } else {
        response.status(401).json({error: 'Embroidery id required'});
    }
}

// update an existing Embroidery object
const updateUserEmbroidery = async (request, response) => {
    const token = request.cookies.token;
    if (token) {
        const {id, name, photos, description, price, features, extraInfo} = request.body;
        try {
            const userData = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );

            if (!userData)
                return response.status(404).json({ error: 'User not found' });

            const embroideryDocument = await Embroidery.findById(id);

            if (userData.id === embroideryDocument.user.toString()) {
                embroideryDocument.set({
                    name: name || embroideryDocument.name,
                    photos: photos || embroideryDocument.photos,
                    description: description || embroideryDocument.description,
                    price: price || embroideryDocument.price,
                    features: features|| embroideryDocument.features,
                    extraInfo: extraInfo || embroideryDocument.extraInfo
                });
                embroideryDocument.save();
                response.status(200).json({message: 'Embroidery successfully updated'});
            }
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

// get all existing embroideries
const getAllEmbroideries = async (request, response) => {
    try {
     const embroideries = await Embroidery.find();
     response.status(200).json(embroideries);
    } catch (error) {
        response.status(400).json({error: `Error fetching all embroideries (${error.message})`})
    }
}

module.exports = {createEmbroidery, getUserEmbroideries, getEmbroideryById, updateUserEmbroidery, getAllEmbroideries};
