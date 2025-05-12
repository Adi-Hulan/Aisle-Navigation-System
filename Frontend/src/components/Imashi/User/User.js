import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaEdit, FaTrash, FaTimes, FaEnvelope, FaPhone, FaUser } from "react-icons/fa";
import '../Imashi.css';

function User({ user }) {
  const {
    _id,
    username,
    firstName,
    lastName,
    email,
    phone,
    job_title,
    salary,
    hire_date,
    is_active,
    created_at,
    last_login,
  } = user;

  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName,
    lastName,
    email,
    phone,
    job_title,
    salary,
    username
  });

  const deleteHandler = async () => {
    if (!window.confirm("Permanently delete this user?")) return;
  
    try {
      const response = await axios.delete(
        `http://localhost:8070/users/delete/${_id}`
      );
  
      if (response.data?.success) {
        toast.success("User deleted successfully!", {
          position: "top-right",
          autoClose: 2000,
          onClose: () => {
            navigate("/User/userdetails");
            window.location.reload();
          },
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8070/users/update/${_id}`,
        formData
      );

      if (response.data) {
        setShowEditModal(false);
        toast.success("User updated successfully!", {
          position: "top-right",
          autoClose: 2000,
          onClose: () => {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <div className="imashi-user-card">
        <div className="imashi-user-card-header">
          <div className="imashi-user-avatar">
            {getInitials(firstName + " " + lastName)}
          </div>
          <div className="imashi-user-info">
            <h3>{firstName} {lastName}</h3>
            <span className="imashi-user-role">{job_title}</span>
          </div>
        </div>

        <div className="imashi-user-details">
          <div className="imashi-user-detail">
            <FaEnvelope />
            <span>{email}</span>
          </div>
          <div className="imashi-user-detail">
            <FaPhone />
            <span>{phone || "N/A"}</span>
          </div>
          <div className="imashi-user-detail">
            <FaUser />
            <span>{username}</span>
          </div>
        </div>

        <div className="imashi-user-actions">
          <button
            className="imashi-btn imashi-btn-secondary"
            onClick={() => setShowEditModal(true)}
          >
            <FaEdit /> Edit
          </button>
          <button
            className="imashi-btn imashi-btn-danger"
            onClick={deleteHandler}
            disabled={!is_active}
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      {showEditModal && (
        <div className="imashi-modal-overlay">
          <div className="imashi-modal-content">
            <button 
              className="imashi-modal-close"
              onClick={() => setShowEditModal(false)}
            >
              <FaTimes />
            </button>
            <form onSubmit={handleSubmit} className="imashi-form">
              <h3 className="imashi-form-title">Edit User Details</h3>
              
              <div className="imashi-form-group">
                <label className="imashi-form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="imashi-form-input"
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Job Title</label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-actions">
                <button
                  type="button"
                  className="imashi-btn imashi-btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="imashi-btn imashi-btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default User;
