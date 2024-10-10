const bcrypt = require('bcryptjs');

/**
 * Encrypts user password sent from frontend register form
 * @param {String} password
 * @returns hashed password
 */
function encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
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

module.exports = { encryptPassword, checkPassword };
