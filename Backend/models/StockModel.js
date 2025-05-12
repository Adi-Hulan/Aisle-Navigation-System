const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    shelf_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelf', required: true },
    quantity: { type: Number, required: true },
    min_qty: { type: Number, required: true },
    max_qty: { type: Number, required: true },
    last_update: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Stock', stockSchema);