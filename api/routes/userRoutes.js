// Importing User Authentication and Profile Routes
const express = require('express');
const {registerUser, loginUser, getProfile, logoutUser} = require('../controllers/userController');

const userRouter = express.Router();

/**
 * @route POST /register
 * @desc Register a new user
 * @access Public
 */
userRouter.post('/register', registerUser);

/**
 * @route POST /login
 * @desc Authenticate user and return a token
 * @access Public
 */
userRouter.post('/login', loginUser);

/**
 * @route GET /profile
 * @desc Get the profile of the logged-in user
 * @access Protected
 */
userRouter.get('/profile', getProfile);

/**
 * @route GET /logout
 * @desc Logout the current user
 * @access Protected
 */
userRouter.get('/logout', logoutUser);

module.exports = userRouter;
