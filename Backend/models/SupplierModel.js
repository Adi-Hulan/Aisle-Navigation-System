const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    supplier_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    is_active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
  });
  
  module.exports = mongoose.model('Supplier', supplierSchema);