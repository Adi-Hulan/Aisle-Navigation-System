const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    cat_name: { type: String, required: true, unique: true },
    description: { type: String }
  });
  
  module.exports = mongoose.model('Category', categorySchema);
