const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    message: { type: String, required: true }, // Stores activity description
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['NEW_PRODUCT_ADDED', 'PRODUCT_DETAIL_UPDATED', 'PRODUCT_PRICE_UPDATED', 'PROMOTION_ADDED_TO_PRODUCT', 'PRODUCT_DELETED', 'PRODUCT_ADDED_TO_INVENTORY', 'PRODUCT_DELETED_FROM_INVENTORY', '', ''], required: true }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);      