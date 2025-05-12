const mongoose = require('mongoose');

const overtimeSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    overtieHhours: { type: Number, required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'OperationManager' },
  });
  
  module.exports = mongoose.model('Overtime', overtimeSchema);