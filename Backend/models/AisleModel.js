const mongoose = require('mongoose');

const aisleSchema = new mongoose.Schema({
    aisle_num: { type: Number, required: true, unique: true },
    aisle_name: { type: String, required: true },
    description: { type: String },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
  });
  
  module.exports = mongoose.model('Aisle', aisleSchema);