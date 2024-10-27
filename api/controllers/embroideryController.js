const Embroidery = require('../models/Embroidery');
const jwt = require('jsonwebtoken');

// create embroidery object
const createEmbroidery = async (request, response) => {
    if (!request.body)
        return response.status(400).json({ error: 'Input fields empty' });

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
    } = request.body;
    const token = request.cookies.token;
    if (token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (!userData)
                return response.status(404).json({ error: 'User not found' });

            const embroideryDocument = await Embroidery.create({
                user: userData.id,
                name,
                description,
                perks,
                addedPhotos,
                extraInfo,
                price,
                packs: Number(packs),
                orderDate,
                deliveryDate,
            });
            response.status(200).json(embroideryDocument);
            console.log(embroideryDocument);
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

// get the user's embroideries
const getUserEmbroideries = async (request, response) => {
    const token = request.cookies.token;
    if (token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (!userData)
                return response.status(404).json({ error: 'User not found' });

            const embroideryDocument = await Embroidery.find({
                user: userData.id,
            });
            response.status(200).json(embroideryDocument);
            console.log(embroideryDocument);
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

// get an embroidery by id
const getEmbroideryById = async (request, response) => {
    const { id } = request.params;

    if (id) {
        // Validate that the ID format is correct
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ error: 'Invalid ID format' });
        }

        try {
            const foundEmbroidery = await Embroidery.findById(id);

            if (!foundEmbroidery)
                return response.status(404).json({ error: 'Embroidery not found' });

            response.status(200).json(foundEmbroidery);
            console.log(foundEmbroidery);
        } catch (error) {
            console.log('Error fetching embroidery: ', error);
            response.status(400).json({ error: 'Embroidery does not exist' });
        }
    } else {
        response.status(401).json({ error: 'Embroidery id required' });
    }
};

// update an existing Embroidery object
const updateUserEmbroidery = async (request, response) => {
    const token = request.cookies.token;
    if (token) {
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
        } = request.body;
        try {
            const userData = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (!userData)
                return response.status(404).json({ error: 'User not found' });

            const embroideryDocument = await Embroidery.findById(id);

            if (userData.id === embroideryDocument.user.toString()) {
                embroideryDocument.set({
                    name: name || embroideryDocument.name,
                    description: description || embroideryDocument.description,
                    perks: perks || embroideryDocument.perks,
                    addedPhotos: addedPhotos || embroideryDocument.addedPhotos,
                    extraInfo: extraInfo || embroideryDocument.extraInfo,
                    price: price || embroideryDocument.price,
                    packs: packs || embroideryDocument.packs,
                    orderDate: orderDate || embroideryDocument.orderDate,
                    deliveryDate:
                        deliveryDate || embroideryDocument.deliveryDate,
                });
                embroideryDocument.save();
                response.status(200).json({
                    message: 'Embroidery successfully updated',
                    embroideryDocument: embroideryDocument,
                });
                console.log(embroideryDocument);
            }
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

// get all existing embroideries
const getAllEmbroideries = async (request, response) => {
    try {
        const embroideries = await Embroidery.find();
        response.status(200).json(embroideries);
        console.log('All embroideries fetched');
    } catch (error) {
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
