const express = require('express');
const router = express.Router();

//Insert model and controller
const Supplier = require("../models/SupplierModel");
const SupplierController = require("../controllers/SupplierController");

//Get all categories
router.get("/", SupplierController.getAllSuppliers);

//add supplier
router.post("/add", SupplierController.addSupplier);

//supplier request routes
router.post("/request", SupplierController.createSupplierRequest);
router.get("/requests", SupplierController.getAllSupplierRequests);
router.get("/requests/:id", SupplierController.getSupplierRequestById);
router.put("/requests/:id/status", SupplierController.updateRequestStatus);

//export
module.exports = router;