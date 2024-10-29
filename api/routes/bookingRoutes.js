// Importing booking modules and controllers
const express = require('express');
const {bookEmbroidery, getUserBookings} = require('../controllers/bookingController');

// Booking Routes
const bookingRouter = express.Router();

/**
 * @route POST /bookings
 * @desc Book an embroidery design
 * @access Public or Protected (based on your authentication setup)
 */
bookingRouter.post('/bookings', bookEmbroidery);

/**
 * @route GET /bookings
 * @desc Get all bookings for the current user
 * @access Protected
 */
bookingRouter.get('/bookings', getUserBookings);

module.exports = bookingRouter;
