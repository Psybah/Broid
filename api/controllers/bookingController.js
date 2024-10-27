const Booking = require('../models/Booking');
// const {getUserDataFromToken} = require('../utils');
const jwt = require("jsonwebtoken");

// make a booking to purchase an embroidery
const bookEmbroidery = async (request, response) => {
    const token = request.cookies.token;
    if (token) {
        const { embroideryId, name, description, addedPhotos,
            perks, extraInfo, price, packs,
            orderDate, deliveryDate} = request.body;

        try {
            const userData =  jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );

            if (!userData)
                return response.status(404).json({ error: 'User not found' });

            const bookingDocument = await Booking.create({
                embroidery: embroideryId, bookedBy: userData.id, name, description, addedPhotos, perks, extraInfo, price, packs, orderDate, deliveryDate});

            response.status(201).json(bookingDocument);
        } catch (error) {
            response.status(500).json({error: `Booking failed (${error})`})
        }
    } else {
        response.status(401).json({ error: 'No token provided' });
    }
}

// get the bookings made by a user
const getUserBookings = async (request, response) => {
    const token = request.cookies.token;
    if (token) {
        try {
            const userData =  jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );

            if (!userData)
                return response.status(404).json({ error: 'User not found' });

            const userBookings = await Booking.find({bookedBy: userData.id}).populate('embroidery');
            response.status(200).json(userBookings);
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

module.exports = {bookEmbroidery, getUserBookings};
