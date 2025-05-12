const mongoose = require('mongoose');
const Feedback = require('../models/FeedBackModel');

// GET all feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find();
    res.json({ feedback });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};

// Add feedback
const addfeedback = async (req, res) => {
  const { name, gmail, description } = req.body;
  try {
    const newFeedback = new Feedback({ name, gmail, description });
    await newFeedback.save();
    res.status(201).json({ message: "Feedback added successfully", feedback: newFeedback });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get feedback by ID
const getById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid feedback ID format' });
    }
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    return res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Update feedback
const updateFeedback = async (req, res) => {
  const id = req.params.id;
  const { name, gmail, description } = req.body;
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { name, gmail, description },
      { new: true }
    );
    if (!updatedFeedback) {
      return res.status(404).json({ message: "Unable to update, feedback not found" });
    }
    return res.status(200).json({ message: "Feedback updated successfully", feedback: updatedFeedback });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    return res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllFeedback,
  addfeedback,
  getById,
  updateFeedback,
  deleteFeedback,
};