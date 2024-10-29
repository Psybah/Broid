const Booking = require('../models/Booking');
// const {getUserDataFromToken} = require('../utils');
const jwt = require("jsonwebtoken");

/**
 * @function bookEmbroidery
 * @desc Creates a booking for an embroidery, storing details about the embroidery and user.
 * @param {Object} request - Express request object, with token in cookies and booking details in the body.
 * @param {Object} response - Express response object, used to send back booking confirmation or error.
 * @access Protected - Requires a valid JWT token in cookies.
 */
const bookEmbroidery = async (request, response) => {
    // Get JWT token from cookies
    const token = request.cookies.token;
    
    if (token) {
        // Destructure required fields from the request body
        const { embroideryId, name, description, addedPhotos,
            perks, extraInfo, price, packs,
            orderDate, deliveryDate} = request.body;

        try {
            // Verify and decode the JWT token to get user data
            const userData =  jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );

            // Check if user data was successfully decoded
            if (!userData)
                return response.status(404).json({ error: 'User not found' });

            // Create a new booking document with provided details
            const bookingDocument = await Booking.create({
                embroidery: embroideryId, bookedBy: userData.id, name, description, addedPhotos, perks, extraInfo, price, packs, orderDate, deliveryDate});

            // Send a success response with the created booking document
            response.status(201).json(bookingDocument);
        } catch (error) {
            // Handle errors and send appropriate response
            response.status(500).json({error: `Booking failed (${error})`})
        }
    } else {
        // If no token is provided, send an unauthorized response
        response.status(401).json({ error: 'No token provided' });
    }
}

/**
 * @function getUserBookings
 * @desc Retrieves all bookings made by the authenticated user.
 * @param {Object} request - Express request object with token in cookies.
 * @param {Object} response - Express response object, used to send back user's bookings or error.
 * @access Protected - Requires a valid JWT token in cookies.
 */
const getUserBookings = async (request, response) => {
    // Get JWT token from cookies
    const token = request.cookies.token;
    
    if (token) {
        try {
            // Verify and decode the JWT token to get user data
            const userData =  jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );

            // Check if user data was successfully decoded
            if (!userData)
                return response.status(404).json({ error: 'User not found' });

            // Find all bookings by the user and populate embroidery details
            const userBookings = await Booking.find({bookedBy: userData.id}).populate('embroidery');
            
            // Send a success response with user's bookings
            response.status(200).json(userBookings);
        } catch (error) {
            // Handle token error or other errors appropriately
            if (error.name === 'JsonWebTokenError') {
                response.status(401).json({ error: 'Invalid token' });
            } else {
                response.status(500).json({ error: error.message });
            }
        }
    } else {
        // If no token is provided, send an unauthorized response
        response.status(401).json({ error: 'No token provided' });
    }
}

module.exports = {bookEmbroidery, getUserBookings};
