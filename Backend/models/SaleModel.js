const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    shelf_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelf', required: true },
    qty: { type: Number, required: true },
    sale_time: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Sale', saleSchema);