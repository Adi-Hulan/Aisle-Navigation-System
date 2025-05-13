const express = require('express');
const router = express.Router();

//Insert model
const StockModel = require("../models/StockModel")

//Insert controller
const StockController = require('../controllers/StockController');

// Stock request routes (must be before /:id route)
router.post("/request", StockController.createStockRequest);
router.get("/requests", StockController.getAllStockRequests);
router.put("/request/:id", StockController.updateStockRequestStatus);

//Get all products
router.get("/get", StockController.getAllProducts);
router.get("/:id", StockController.getById);
router.post("/add", StockController.addProductToStock);
router.put("/:id", StockController.updateproduct);
router.delete("/:id", StockController.deleteproduct);

//export
module.exports = router;