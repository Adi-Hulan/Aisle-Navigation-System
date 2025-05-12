const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    product_name: {type:String},
    current_stock: { type: Number, required: true },
    min_quan: { type: Number, required: true },
    max_quan: { type: Number, required: true },
    last_updated: { type: Date, default: Date.now },
    cat_id: { type: String, required: true },
    cat_name: { type: String }
  });
  
  module.exports = mongoose.model('Inventory', inventorySchema);