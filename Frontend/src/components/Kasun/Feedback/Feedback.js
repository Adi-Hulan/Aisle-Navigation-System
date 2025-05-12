import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaComment, FaEdit, FaTrash } from 'react-icons/fa';
import UpdateFeedback from "../UpdateFeedback/UpdateFeedback";

function Feedback(props) {
  const { _id, name, gmail, description } = props.feedback;
  const navigate = useNavigate();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const deleteHandler = async () => {
    try {
      await axios.delete(`http://localhost:8070/feedback/${_id}`); 
      alert("Feedback deleted successfully");
      navigate("/feedbackdetails");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert("Failed to delete feedback. Please try again.");
    }
  };

  const handleUpdate = () => {
    setShowUpdateModal(true);
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
  };

  const handleUpdateSuccess = () => {
    // Refresh the feedback list by calling the parent component's refresh function
    if (props.onFeedbackUpdate) {
      props.onFeedbackUpdate();
    } else {
      // Fallback to page reload if no refresh function is provided
      window.location.reload();
    }
  };

  return (
    <>
      <div className="feedback-card">
        <div className="feedback-header">
          <div className="user-avatar">
            <FaUser />
          </div>
          <div className="user-info">
            <h3 className="user-name">{name}</h3>
            <p className="feedback-date">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="feedback-content">
          <div className="feedback-detail">
            <FaEnvelope className="feedback-icon" />
            <p>{gmail}</p>
          </div>
          <div className="feedback-detail">
            <FaComment className="feedback-icon" />
            <p>{description}</p>
          </div>
        </div>

        <div className="feedback-actions">
          <button onClick={handleUpdate} className="edit-btn">
            <FaEdit /> Edit
          </button>
          <button onClick={deleteHandler} className="delete-btn">
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      {showUpdateModal && (
        <UpdateFeedback
          feedback={props.feedback}
          onClose={handleCloseModal}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </>
  );
}

export default Feedback;
