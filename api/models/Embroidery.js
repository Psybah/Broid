const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmbroiderySchema = new Schema({
    sator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String,
    photos: [String],
    description: String,
    price: Number,
    features: [String],
    extraInfo: String,
    numberOfViews: Number,
    numberPurchased: Number,
});

const EmbroideryModel = mongoose.model('Embroidery', EmbroiderySchema);

module.exports = EmbroideryModel;
