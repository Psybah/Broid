const express = require('express');
const {registerUser, loginUser, getProfile, logoutUser} = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', getProfile);
userRouter.get('/logout', logoutUser);

module.exports = userRouter;
