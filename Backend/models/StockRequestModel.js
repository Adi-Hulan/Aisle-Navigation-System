const mongoose = require('mongoose');

const stockRequestSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    requested_date: { type: Date, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected", "completed"], default: "pending" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  }, {
    timestamps: true // This will automatically handle created_at and updated_at
  });
  
  // Add index for better query performance
  stockRequestSchema.index({ product_id: 1, created_at: -1 });
  stockRequestSchema.index({ status: 1 });

  const StockRequest = mongoose.model('StockRequest', stockRequestSchema);

  module.exports = StockRequest;