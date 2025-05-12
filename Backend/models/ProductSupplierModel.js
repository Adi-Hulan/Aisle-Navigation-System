const mongoose = require('mongoose');

const productSupplierSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    supply_price: { type: Number, required: true },
    qty: { type: Number, required: true }
  });
  
  module.exports = mongoose.model('ProductSupplier', productSupplierSchema);