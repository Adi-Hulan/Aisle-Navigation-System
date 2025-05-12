const mongoose = require('mongoose');

const outletSchema = new mongoose.Schema({
  outletCode: {
    type: String,
    required: true,
    unique: true, // Ensure outletCode is unique
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  contactNumber: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the users collection
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  openingDate: {
    type: Date,
    required: true,
  },
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Closed', 'Renovating', 'Opening Soon'], // Allowed values
  },
  features: {
    type: [String], // Array of strings
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date
  },
});

// Middleware to update the `updatedAt` field before saving
outletSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Mongoose model
const Outlet = mongoose.model('Outlet', outletSchema);

module.exports = Outlet;