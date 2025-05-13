const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  min_qty: { type: Number, required: true },
  max_qty: { type: Number, required: true },
  location: {
    aisle_number: { type: Number, required: true },
    shelf_number: { type: Number, required: true },
    row_number: { type: Number, required: true },
  },
  last_update: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Stock", stockSchema);
