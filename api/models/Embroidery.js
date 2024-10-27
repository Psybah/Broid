const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const EmbroiderySchema = new Schema({
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

const EmbroideryModel = mongoose.model('Embroidery', EmbroiderySchema);

module.exports = EmbroideryModel;
