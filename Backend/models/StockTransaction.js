const mongoose = require('mongoose');

const stockTransactionSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true },
    transaction_date: { type: Date, default: Date.now },
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approved_date: { type: Date }
  });
  
  module.exports = mongoose.model('StockTransaction', stockTransactionSchema);