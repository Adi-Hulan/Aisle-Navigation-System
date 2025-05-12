const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    report_type: { type: String, required: true },
    generated_on: { type: Date, default: Date.now },
    data: { type: mongoose.Schema.Types.Mixed }
  });
  
  module.exports = mongoose.model('Report', reportSchema);