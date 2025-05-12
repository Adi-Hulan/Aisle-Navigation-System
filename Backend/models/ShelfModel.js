const mongoose = require('mongoose');

const shelfSchema = new mongoose.Schema({
    aisle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Aisle', required: true },
    shelf_num: { type: Number, required: true },
    level: { type: Number, required: true },
    capacity: { type: Number, required: true }
  });
  
  module.exports = mongoose.model('Shelf', shelfSchema);