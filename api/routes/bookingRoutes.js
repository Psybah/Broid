const express = require('express');
const {bookEmbroidery, getUserBookings} = require('../controllers/bookingController');

const bookingRouter = express.Router();

bookingRouter.post('/bookings', bookEmbroidery);
bookingRouter.get('/bookings', getUserBookings);

module.exports = bookingRouter;
