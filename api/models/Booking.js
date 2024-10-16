const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookingSchema = new Schema({
    embroidery: {type: mongoose.Schema.Types.ObjectId, ref: 'Embroidery', required: true},
    bookedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, required: true},
    phone: {type: String, required: true},
    quantity: {type: String, required: true},
    price: Number
});

const BookingModel = mongoose.model('Booking', BookingSchema);

module.exports = BookingModel;
