// Importing necessary modules and controllers
const express = require('express');
const {createEmbroidery, getUserEmbroideries, getEmbroideryById, updateUserEmbroidery, getAllEmbroideries} = require('../controllers/embroideryController');

// Ebroidery Routes
const embroideryRouter = express.Router();

/**
 * @route POST /embroidery
 * @desc Create a new embroidery design
 * @access Admin or Authorized users
 */
embroideryRouter.post('/embroidery', createEmbroidery);

/**
 * @route GET /embroidery
 * @desc Get all embroideries associated with the current user
 * @access Protected
 */
embroideryRouter.get('/embroidery', getUserEmbroideries);

/**
 * @route GET /embroidery-by-id
 * @desc Fetch embroidery details by ID
 * @access Public or Protected (based on authentication)
 */
embroideryRouter.get('/embroidery-by-id', getEmbroideryById);

/**
 * @route PUT /update-embroidery
 * @desc Update an existing embroidery design
 * @access Admin or Authorized users
 */
embroideryRouter.put('/update-embroidery', updateUserEmbroidery);

/**
 * @route GET /embroideries
 * @desc Get all embroidery designs
 * @access Public or Protected
 */
embroideryRouter.get('/embroideries', getAllEmbroideries);

module.exports = embroideryRouter;
