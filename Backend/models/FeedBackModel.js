const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Time } = require('node:console');

const FeedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gmail: {type: String, required: true},
    description: { type: String, required: true }
  });
  
module.exports = mongoose.model('Feedback', FeedbackSchema);