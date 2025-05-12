/***
 * @Developed By: Udayanga
 * @Developed On: 22th March 2025
 */

const express = require("express");
const router = express.Router();

//Insert model and controller
const Product = require("../models/ProductModel");
const ProductController = require("../controllers/ProductController");

//Add a product
router.post("/add", ProductController.addProduct);

//Get all products
router.get("/", ProductController.getAllProducts);

router.get("/withDet", ProductController.getAllProductsWithDet);

//Get by ID
router.get("/:id", ProductController.getById);

//update product details
router.put("/update/:id", ProductController.updateProduct);

//Update product price
router.post("/updateprice", ProductController.updateProductPrice);

//add promotion to product
router.post("/addpromotion", ProductController.addPromotions);

//delete product
router.delete("/delete/:id", ProductController.deleteProduct);

//search product by name
router.get("/search", ProductController.searchProducts);

//export
module.exports = router;
