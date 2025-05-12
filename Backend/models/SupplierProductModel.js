const mongoose = require('mongoose');

const SupplierProductSchema = new mongoose.Schema({
    Product_name: { type: String, required: true},
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    last_update: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('SupplierInventory', SupplierProductSchema);