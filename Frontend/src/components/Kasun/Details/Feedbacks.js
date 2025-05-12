import React, { useEffect, useState } from 'react'; 
import axios from "axios";
import Feedback from '../Feedback/Feedback';
import { FaSearch, FaComments } from 'react-icons/fa';

const URL = "http://localhost:8070/feedback";

function Feedbacks() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await axios.get(URL);
      const receivedData = response.data;
      const feedbackData = Array.isArray(receivedData) ? receivedData : receivedData?.feedback;

      if (!feedbackData) {
        throw new Error("Invalid data format: Expected array or { feedback: array }");
      }

      setFeedback(feedbackData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
      setError(err.message);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSearch = () => {
    if (!searchQuery) {
      fetchFeedback();
      return;
    }

    const filteredFeedback = feedback.filter((feedbackItem) =>
      Object.values(feedbackItem || {}).some((field) =>
        field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    setFeedback(filteredFeedback);
    setNoResults(filteredFeedback.length === 0);
  };

  const handleFeedbackUpdate = () => {
    fetchFeedback(); // Refresh the feedback list
  };

  if (loading) {
    return (
      <div className="feedback-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <h2>Loading feedback...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedback-page">
        <div className="error-container">
          <h1>Error Loading Feedback</h1>
          <p className="error-message">{error}</p>
          <p className="error-details">Check if the backend is running at: {URL}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <div className="feedback-header">
          <h1><FaComments className="header-icon" /> Customer Feedback</h1>
          <p>Read what our customers have to say about their experience</p>
        </div>

        <div className="search-container">
          <div className="search-wrapper">
            <div className="search-input-group">
              <input 
                type="text"
                name="search"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch} className="search-button">
                <FaSearch />
              </button>
            </div>
          </div>
        </div>

        {noResults ? (
          <div className="no-results">
            <p>No feedback found matching your search.</p>
            <button onClick={() => {
              setSearchQuery("");
              fetchFeedback();
            }} className="view-all-btn">
              View All Feedback
            </button>
          </div>
        ) : (
          <div className="feedback-grid">
            {feedback.length === 0 ? (
              <div className="no-feedback">
                <p>No feedback available in the database.</p>
              </div>
            ) : (
              feedback.map((feedbackItem) => (
                <Feedback 
                  key={feedbackItem._id} 
                  feedback={feedbackItem}
                  onFeedbackUpdate={handleFeedbackUpdate}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedbacks;
