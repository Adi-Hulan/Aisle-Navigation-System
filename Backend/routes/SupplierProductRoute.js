const express = require('express');
const router = express.Router();

//Insert model
const SupplierProductModel = require("../models/SupplierProductModel");

//Insert controller
const SupplierProductController = require('../controllers/SupplierProductController');

//Get all products
router.get("/", SupplierProductController.getAllProducts);
router.post("/add", SupplierProductController.addProduct);
router.get("/:id", SupplierProductController.getById);
router.put("/:id", SupplierProductController.updateProduct);
router.delete("/:id", SupplierProductController.deleteProduct);

//export
module.exports = router;