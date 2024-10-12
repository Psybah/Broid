const express = require('express');
const {createEmbroidery, getEmbroidery} = require('../controllers/embroideryController');

const embroideryRouter = express.Router();

embroideryRouter.post('/embroidery', createEmbroidery);
embroideryRouter.get('/embroidery', getEmbroidery);

module.exports = embroideryRouter;
