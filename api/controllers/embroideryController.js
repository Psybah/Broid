const Embroidery = require('../models/Embroidery');
const jwt = require('jsonwebtoken');

/**
 * @function createEmbroidery
 * @desc Creates a new embroidery item and saves it in the database.
 * @param {object} request - Express request object, expects embroidery details in `request.body`.
 * @param {object} response - Express response object.
 * @access Protected - Requires JWT token for authentication.
 */
const createEmbroidery = async (request, response) => {
    // Destructure fields from request body and validate required fields
    const {
        name,
        description,
        perks,
        addedPhotos,
        extraInfo,
        price,
        packs,
        orderDate,
        deliveryDate,
    } = request.body || {};

    // Check if required fields are present
    if (!name || !description || !price || !packs || !orderDate || !deliveryDate) {
        return response.status(400).json({ error: 'Required fields are missing' });
    }

    const token = request.cookies.token;

    if (token) {
        try {
            // Verify the JWT token to extract user data
            const userData = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (!userData) {
                return response.status(404).json({ error: 'User not found' });
            }

            // Create a new embroidery item using user-provided data
            const embroideryDocument = await Embroidery.create({
                user: userData.id,
                name,
                description,
                perks,
                photos: addedPhotos, // Ensure it aligns with schema
                extraInfo,
                price,
                packs: Number(packs),
                orderDate,
                deliveryDate,
            });

            // Respond with the created embroidery document
            response.status(200).json(embroideryDocument);
            console.log("Embroidery created:", embroideryDocument);
        } catch (error) {
            // Error handling for invalid token or other server errors
            console.log("Error in createEmbroidery:", error); // Log error for debugging
            if (error.name === 'JsonWebTokenError') {
                response.status(401).json({ error: 'Invalid token' });
            } else {
                response.status(500).json({ error: error.message });
            }
        }
    } else {
        // If no token is found in the cookies, respond with unauthorized error
        response.status(401).json({ error: 'No token provided' });
    }
};


/**
 * @function getUserEmbroideries
 * @desc Retrieves all embroidery items associated with the authenticated user.
 * @param {object} request - Express request object.
 * @param {object} response - Express response object.
 * @access Protected - Requires JWT token for authentication.
 */
const getUserEmbroideries = async (request, response) => {
    const token = request.cookies.token;
    if (token) {
        try {
            // Verify the JWT token to extract user data
            const userData = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (!userData)
                return response.status(404).json({ error: 'User not found' });

            // Fetch all embroideries created by the authenticated user
            const embroideryDocument = await Embroidery.find({
                user: userData.id,
            });
            response.status(200).json(embroideryDocument);
            console.log(embroideryDocument);
        } catch (error) {
            // Error handling for invalid token or server errors
            if (error.name === 'JsonWebTokenError') {
                response.status(401).json({ error: 'Invalid token' });
            } else {
                response.status(500).json({ error: error.message });
            }
        }
    } else {
        // If no token is found in the cookies, respond with unauthorized error
        response.status(401).json({ error: 'No token provided' });
    }
};

/**
 * @function getEmbroideryById
 * @desc Retrieves a specific embroidery item by its ID.
 * @param {object} request - Express request object, expects `id` in `request.body`.
 * @param {object} response - Express response object.
 */
const getEmbroideryById = async (request, response) => {
    const { id } = request.body;

    if (id) {
        // Validate that the ID is in a correct MongoDB ObjectID format
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ error: 'Invalid ID format' });
        }

        try {
            // Search for the embroidery item in the database by ID
            const foundEmbroidery = await Embroidery.findOne({
                _id: id,
            });

            if (!foundEmbroidery)
                return response
                    .status(404)
                    .json({ error: 'Embroidery not found' });

            response.status(200).json(foundEmbroidery);
            console.log(foundEmbroidery);
        } catch (error) {
            // Error handling for server errors
            console.log('Error fetching embroidery: ', error);
            response.status(400).json({ error: 'Embroidery does not exist' });
        }
    } else {
        // Respond with an error if ID is missing in the request
        response.status(401).json({ error: 'Embroidery id required' });
    }
};

/**
 * @function updateUserEmbroidery
 * @desc Updates an existing embroidery item owned by the authenticated user.
 * @param {object} request - Express request object, expects embroidery details in `request.body`.
 * @param {object} response - Express response object.
 * @access Protected - Requires JWT token for authentication.
 */
const updateUserEmbroidery = async (request, response) => {
    const token = request.cookies.token;
    if (token) {
        const {
            id,
            name,
            description,
            perks,
            addedPhotos,
            extraInfo,
            price,
            packs,
            orderDate,
            deliveryDate,
        } = request.body;
        try {
            // Verify the JWT token to extract user data
            const userData = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (!userData)
                return response.status(404).json({ error: 'User not found' });

            // Find the embroidery item by ID and verify ownership
            const embroideryDocument = await Embroidery.findById(id).exec();

            if (userData.id === embroideryDocument.user.toString()) {
                embroideryDocument.set({
                    name: name || embroideryDocument.name,
                    description: description || embroideryDocument.description,
                    perks: perks || embroideryDocument.perks,
                    addedPhotos: addedPhotos || embroideryDocument.addedPhotos,
                    extraInfo: extraInfo || embroideryDocument.extraInfo,
                    price: price || embroideryDocument.price,
                    packs: Number(packs) || embroideryDocument.packs,
                    orderDate: orderDate || embroideryDocument.orderDate,
                    deliveryDate:
                        deliveryDate || embroideryDocument.deliveryDate,
                });

                // Save the updated embroidery document
                embroideryDocument.save();
                response
                    .status(200)
                    .json({ message: 'Embroidery successfully updated' });
                console.log(
                    'Embroidery successfully updated',
                    embroideryDocument
                );
            }
        } catch (error) {
            // Error handling for invalid token or server errors
            if (error.name === 'JsonWebTokenError') {
                response.status(401).json({ error: 'Invalid token' });
            } else {
                response.status(500).json({ error: error.message });
            }
        }
    } else {
        // Respond with an error if token is missing
        response.status(401).json({ error: 'No token provided' });
    }
};

/**
 * @function getAllEmbroideries
 * @desc Retrieves all embroidery items from the database.
 * @param {object} request - Express request object.
 * @param {object} response - Express response object.
 */
const getAllEmbroideries = async (request, response) => {
    try {
        // Retrieve all embroideries
        const embroideries = await Embroidery.find();
        response.status(200).json(embroideries);
        console.log('All embroideries fetched');
    } catch (error) {
        // Error handling for server errors
        response.status(400).json({
            error: `Error fetching all embroideries (${error.message})`,
        });
    }
};

module.exports = {
    createEmbroidery,
    getUserEmbroideries,
    getEmbroideryById,
    updateUserEmbroidery,
    getAllEmbroideries,
};
