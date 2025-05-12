const mongoose = require('mongoose');

const inventoryManagerSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hire_date: { type: Date, required: true },
    job_title: { type: String, default: 'Inventory Manager' },
    section: { type: String },
    salary: { type: Number, required: true }
  });
  
  module.exports = mongoose.model('InventoryManager', inventoryManagerSchema);