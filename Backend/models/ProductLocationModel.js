const mongoose = require('mongoose');

const productLocationSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    aisle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Aisle', required: true },
    shelf_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelf', required: true },
    is_promotional: { type: Boolean, default: false }
  });
  
  module.exports = mongoose.model('ProductLocation', productLocationSchema);