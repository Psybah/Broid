const jwt = require('jsonwebtoken');
const { encryptPassword, checkPassword } = require('../utils');
const User = require('../models/User');

/**
 * @function registerUser
 * @desc Registers a new user by saving their name, email, and encrypted password to the database.
 * @param {object} request - Express request object, expects `name`, `email`, and `password` in `request.body`.
 * @param {object} response - Express response object.
 */
const registerUser = async (request, response) => {
    const { name, email, password } = request.body;

    // Validate required fields
    if (!name || !email || !password) {
        return response
            .status(400)
            .json({ error: 'Name, email and password required' });
    }

    try {
        // Encrypt password and create new user
        const newUser = await User.create({
            name,
            email,
            password: encryptPassword(password),
        });

        // Respond with the created user object (excluding password in a real app)
        response.status(201).json(newUser);
    } catch (error) {
        // Catch database or validation errors and respond accordingly
        console.log(error);
        response.status(422).json({ error: error.message });
    }
}

/**
 * @function loginUser
 * @desc Authenticates a user by checking their email and password, then issues a JWT if successful.
 * @param {object} request - Express request object, expects `email` and `password` in `request.body`.
 * @param {object} response - Express response object.
 */
const loginUser = async (request, response) => {
    const { email, password } = request.body;

    // Validate required fields
    if (!email || !password)
        return response
            .status(400)
            .json({ error: 'Email and password required' });

    try {
        // Attempt to find user by email
        const user = await User.findOne({ email });

        if (user) {
            // Validate the password
            const isValidPassword = checkPassword(password, user.password);

            if (isValidPassword) {
                // Generate a JWT with user details
                jwt.sign(
                    { id: user._id, email: user.email, name: user.name },
                    process.env.JWT_SECRET_KEY,
                    {},
                    (error, token) => {
                        if (error) throw error;

                        // Set the JWT as a cookie and respond with success
                        response.cookie('token', token).json({
                            'Logged in as: ': user.email,
                            token: token,
                        });
                    }
                );
            } else {
                // If password is invalid, respond with an unauthorized error
                response.status(401).json({ error: 'Invalid password' });
            }
        } else {
            // If no user is found, respond with a not found error
            response.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        // Handle server errors
        response.status(500).json({ error: error.message });
    }
}

/**
 * @function getProfile
 * @desc Retrieves the logged-in user's profile based on the JWT token in the cookies.
 * @param {object} request - Express request object, expects JWT token in `request.cookies`.
 * @param {object} response - Express response object.
 */
const getProfile = async (request, response) => {
    const token = request.cookies.token;

    if (token) {
        try {
            // Verify and decode the JWT to retrieve user ID
            const decodedPassword = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );
            const userId = decodedPassword.id;

            // Retrieve the user document from the database
            const userDocument = await User.findById(userId);

            if (!userDocument)
                // If user not found, return a 404 error
                return response.status(404).json({ error: 'User not found' });

            // Respond with user details
            response.status(200).json(userDocument);
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                // Handle invalid token error
                response.status(401).json({ error: 'Invalid token' });
            } else {
                // Handle other server errors
                response.status(500).json({ error: error.message });
            }
        }
    } else {
        // If token is missing, respond with an unauthorized error
        response.status(401).json({ error: 'No token provided' });
    }
}

/**
 * @function logoutUser
 * @desc Logs the user out by clearing the JWT cookie.
 * @param {object} request - Express request object, expects JWT token in `request.cookies`.
 * @param {object} response - Express response object.
 */
const logoutUser = (request, response) => {
    const token = request.cookies.token;
    if (token) {
        try {
            // Verify the JWT before clearing it
            jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );

            // Clear the token cookie and confirm logout
            response.clearCookie('token').json({ message: 'Logged out'});
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                // Handle invalid token error
                response.status(401).json({ error: 'Invalid token' });
            } else {
                // Handle other server errors
                response.status(500).json({ error: error.message });
            }
        }
    } else {
        // If token is missing, respond with an unauthorized error
        response.status(401).json({ error: 'No token provided' });
    }
}

module.exports = {registerUser, loginUser, getProfile, logoutUser};
