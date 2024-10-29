const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the User schema to represent a user account
const UserSchema = new Schema({
    name: String,

    // Unique email address for the user; used as their login identifier
    email: {type: String, unique: true},

    password: String,
});

// Create and export the User model based on the User schema
const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
