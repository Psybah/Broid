const Booking = require('../models/Booking');
const {getUserDataFromToken} = require('../utils');
// const jwt = require("jsonwebtoken");

// make a booking to purchase an embroidery
const bookEmbroidery = async (request, response) => {
    const token = request.cookies.token;
    if (token) {
        const {embroidery, name, phone,quantity, price} = request.body;
        if (!embroidery || !name || !phone || !quantity) return response.status(400).json({error: 'Incomplete' +
                ' booking info'});

        try {
            const userData = getUserDataFromToken(token);
            if (!userData)
                return response.status(404).json({ error: 'User not found' });

            const bookingDocument = await Booking.create({
                embroidery, bookedBy: userData.id, name, phone,quantity, price});

            response.status(201).json(bookingDocument);
        } catch (error) {
            response.status(500).json({error: `Booking failed (${error})`})
        }
    } else {
        response.status(401).json({ error: 'No token provided' });
    }
}

// get bookings made by a user
const getUserBookings = async (request, response) => {
    const token = request.cookies.token;
    if (token) {
        try {
            const userData = getUserDataFromToken(token);
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
