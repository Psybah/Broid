const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

// Define the Booking schema with required fields and types
const BookingSchema = new Schema({
    
    // Reference to the Embroidery model for the embroidery associated with this booking
    embroidery: {type: SchemaTypes.ObjectId, ref: 'Embroidery', required: true},
    
    // Reference to the User model for the user who made the booking
    bookedBy: {type: SchemaTypes.ObjectId, ref: 'User', required: true},
    
    name: {type: String, required: true},
    decription: String,
    addedPhotos: [String],
    perks: {type: [String], required: true},
    extraInfo: {type: String, required: true},
    price: {type: String, required: true},
    packs: {type: Number, required: true},
    orderDate: {type: String, required: true},
    deliveryDate: {type: String, required: true},
});


// Create and export the Booking model based on the Booking schema
const BookingModel = mongoose.model('Booking', BookingSchema);

module.exports = BookingModel;
