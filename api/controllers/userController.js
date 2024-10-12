const jwt = require('jsonwebtoken');
const { encryptPassword, checkPassword } = require('../utils');
const User = require('../models/User');

// register user route
const registerUser = async (request, response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
        return response
            .status(400)
            .json({ error: 'Name, email and password required' });
    }

    try {
        const newUser = await User.create({
            name,
            email,
            password: encryptPassword(password),
        });

        response.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        response.status(422).json({ error: error.message });
    }
}

// login route
const loginUser = async (request, response) => {
    const { email, password } = request.body;

    if (!email || !password)
        return response
            .status(400)
            .json({ error: 'Email and password required' });

    try {
        const user = await User.findOne({ email });

        if (user) {
            const isValidPassword = checkPassword(password, user.password);

            if (isValidPassword) {
                jwt.sign(
                    { id: user._id, email: user.email, name: user.name },
                    process.env.JWT_SECRET_KEY,
                    {},
                    (error, token) => {
                        if (error) throw error;
                        response.cookie('token', token).json({
                            'Logged in as: ': user.email,
                            token: token,
                        });
                    }
                );
            } else {
                response.status(401).json({ error: 'Invalid password' });
            }
        } else {
            response.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
}

// user profile endpoint
const getProfile = async (request, response) => {
    const token = request.cookies.token;
    if (token) {
        try {
            const decodedPassword = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );
            const userId = decodedPassword.id;

            const userDocument = await User.findById(userId);

            if (!userDocument)
                return response.status(404).json({ error: 'User not found' });

            response.status(200).json(userDocument);
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                response.status(401).json({ error: 'Invalid token' });
            } else {
                response.status(500).json({ error: error.message });
            }
        }
    } else {
        response.status(401).json({ error: 'No token provided' });
    }
}

// logout route
const logoutUser = (request, response) => {
    response.clearCookie('token').json({ message: 'Logged out' });
}


module.exports = {registerUser, loginUser, getProfile, logoutUser};
