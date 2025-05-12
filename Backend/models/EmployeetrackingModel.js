const mongoose = require('mongoose');

const employeeTrackingSchema = new mongoose.Schema({
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    location: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    unauthorized_movement: { type: Boolean, default: false }
  });
  
  module.exports = mongoose.model('EmployeeTracking', employeeTrackingSchema);