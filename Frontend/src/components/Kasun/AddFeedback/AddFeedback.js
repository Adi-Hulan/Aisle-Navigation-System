import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaComment, FaPaperPlane } from 'react-icons/fa';

function AddFeedback() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    gmail: "",
    description: "",
  });

  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history('/feedbackdetails'))
  }

  const sendRequest = async () => {
    await axios.post("http://localhost:8070/feedback", {
      name: String(inputs.name),
      gmail: String(inputs.gmail),
      description: String(inputs.description),
    }).then(res => res.data);
  }

  useEffect(() => {
    fetch("http://localhost:8070/category")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <div className="feedback-header">
          <h1>Share Your Feedback</h1>
          <p>We value your opinion! Please take a moment to share your thoughts with us.</p>
        </div>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FaUser className="input-icon" />
              Name
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={inputs.name}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FaEnvelope className="input-icon" />
              Email
            </label>
            <input
              type="email"
              name="gmail"
              onChange={handleChange}
              value={inputs.gmail}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FaComment className="input-icon" />
              Your Feedback
            </label>
            <textarea
              name="description"
              onChange={handleChange}
              value={inputs.description}
              placeholder="Share your thoughts with us..."
              required
            />
          </div>

          <button type="submit" className="submit-button">
            <FaPaperPlane className="button-icon" />
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddFeedback;
