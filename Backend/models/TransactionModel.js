const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity_sold: { type: Number, required: true },
    sale_date: { type: Date, default: Date.now },
    total_price: { type: Number, required: true }
  });
  
  module.exports = mongoose.model('Transaction', transactionSchema);