const express = require('express');
const router = express.Router();

//Insert model and controller
const Promotion = require("../models/PromotionModel");
const PromotionController = require('../controllers/PromotionController');

//Get all categories
router.get("/", PromotionController.getAllPromotions);

//export
module.exports = router;