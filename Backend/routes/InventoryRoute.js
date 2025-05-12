/***
 * @Developed By: Udayanga
 * @Developed On: 22th March 2025
 */

const express = require('express');
const router = express.Router();

//Insert model and controller
const Inventory = require("../models/InventoryModel");
const InventoryController = require('../controllers/InventoryController');

//Get all inventory
router.get("/", InventoryController.getAllInventory);

//Get inventory count
router.get("/count", InventoryController.getInventoryCount);

//Get low stock count
router.get("/lowstock", InventoryController.getLowStockCount);

//Get expiring item count
router.get("/expiring", InventoryController.getExpiringCount);

//Get expired item count
router.get("/expired", InventoryController.getExpiredCount);

//Get All Inventory Logs
router.get("/logs", InventoryController.getRecentActivity);

//Add product to inventory
router.post("/add", InventoryController.addProductsToInventory);

//get inventory product by id
router.get("/:product_id", InventoryController.getById);

//get inventory by category
router.get("/category/:cat_id", InventoryController.getByCategory);

//delete product
router.delete("/delete/:product_id", InventoryController.deleteProduct);

//export
module.exports = router;