const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

// Define the Embroidery schema with fields for the embroidery item details
const EmbroiderySchema = new Schema({
    // Reference to the User model for the user who created or owns this embroidery item
    user: {type: SchemaTypes.ObjectId, ref: 'User'},
    name: String,
    description: String,
    photos: [String],
    perks: [String],
    extraInfo: String,
    price: String,
    packs: Number,
    orderDate: String,
    deliveryDate: String,
});

// Create and export the Embroidery model based on the Embroidery schema
const EmbroideryModel = mongoose.model('Embroidery', EmbroiderySchema);

module.exports = EmbroideryModel;
