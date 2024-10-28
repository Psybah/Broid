const express = require('express');
const {createEmbroidery, getUserEmbroideries, getEmbroideryById, updateUserEmbroidery, getAllEmbroideries} = require('../controllers/embroideryController');

const embroideryRouter = express.Router();

embroideryRouter.post('/embroidery', createEmbroidery);
embroideryRouter.get('/embroidery', getUserEmbroideries);
embroideryRouter.get('/embroidery-by-id', getEmbroideryById);
embroideryRouter.put('/update-embroidery', updateUserEmbroidery);
embroideryRouter.get('/embroideries', getAllEmbroideries);

module.exports = embroideryRouter;
