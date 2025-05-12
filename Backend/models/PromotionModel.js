const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    discount_type: { type: String, required: true },
    discount_value: { type: Number, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
  });
  
  module.exports = mongoose.model('Promotion', promotionSchema);