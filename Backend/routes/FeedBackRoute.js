const express = require ("express");
const router = express.Router();
const feedbackController = require('../controllers/FeedBackcontroller');
    
router.get("/", feedbackController.getAllFeedback);
router.post("/", feedbackController.addfeedback);
router.get("/:id", feedbackController.getById);
router.put("/:id", feedbackController.updateFeedback);
router.delete("/:id", feedbackController.deleteFeedback);

module.exports = router;