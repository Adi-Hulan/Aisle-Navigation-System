import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaUser, FaEnvelope, FaComment } from 'react-icons/fa';

function UpdateFeedback({ feedback, onClose, onUpdate }) {
    const [inputs, setInputs] = useState({
        name: '',
        gmail: '',
        description: ''
    });

    // Initialize form with feedback data when component mounts
    useEffect(() => {
        if (feedback) {
            setInputs({
                name: feedback.name || '',
                gmail: feedback.gmail || '',
                description: feedback.description || ''
            });
        }
    }, [feedback]);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8070/feedback/${feedback._id}`, {
                name: inputs.name,
                gmail: inputs.gmail,
                description: inputs.description,
            });

            if (response.status === 200) {
                alert("Feedback updated successfully!");
                onUpdate(); // Refresh the feedback list
                onClose(); // Close the modal
            }
        } catch (error) {
            console.error("Error updating feedback:", error);
            alert("Failed to update feedback. Please try again.");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Update Feedback</h2>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form className="feedback-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">
                            <FaUser className="form-icon" /> Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={inputs.name}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <FaEnvelope className="form-icon" /> Email
                        </label>
                        <input
                            type="email"
                            name="gmail"
                            value={inputs.gmail}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <FaComment className="form-icon" /> Description
                        </label>
                        <textarea
                            name="description"
                            value={inputs.description}
                            onChange={handleChange}
                            className="form-input"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Update Feedback
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateFeedback;
