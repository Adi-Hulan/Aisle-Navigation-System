const express = require('express');
const router = express.Router();

//Insert model and controller
const Category = require("../models/CategoryModel");
const CategoryController = require('../controllers/CategoryController');

//Get all categories
router.get("/", CategoryController.getAllCategories);

//Add categpry
router.post("/add", CategoryController.addCategory);

//export
module.exports = router;