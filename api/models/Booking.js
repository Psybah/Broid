const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const BookingSchema = new Schema({
    embroidery: {type: SchemaTypes.ObjectId, ref: 'Embroidery', required: true},
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

const BookingModel = mongoose.model('Booking', BookingSchema);

module.exports = BookingModel;
