const mongoose = require('mongoose');

const stockRequestSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    req_qty: { type: Number, required: true },
    req_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    req_date: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('StockRequest', stockRequestSchema);