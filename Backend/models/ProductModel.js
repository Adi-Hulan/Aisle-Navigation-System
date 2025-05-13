const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  pr_name: { type: String, required: true },
  description: { type: String },
  cat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  barcode: { type: String, unique: true },
  shelf: { type: String },
  aisle: { type: String },
  row: { type: String },
  unit_price: { type: Number, required: true },
  is_active: { type: Boolean, default: true },
  added_on: { type: Date, default: Date.now },
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  exp_date: { type: Date },
  image_url: { type: String, default: "" },
  promotions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Promotion" }],
});

module.exports = mongoose.model("Product", productSchema);
