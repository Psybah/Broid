const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

/**
 * Encrypts user password sent from frontend register form
 * @param {String} password
 * @returns hashed password
 */
function encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

/**
 * Checks if hashed password was derived from plain password
 * @param {String} plainPassword
 * @param {String} hashedPassword
 * @returns true if plain password is hashed password
 */
function checkPassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
}

/**
 * Extract user data from token got from request.cookies
 * @param token
 * @returns {Object} - userData
 */
function getUserDataFromToken(token) {
    return jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
    );
}

module.exports = { encryptPassword, checkPassword, getUserDataFromToken };
