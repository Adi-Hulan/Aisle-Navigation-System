import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Udayanga.css";
import Nav from "./InventoryHeader/InventoryHeader";

function StockRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8070/stock/requests");
      console.log(response.data);
      if (response.data.success) {
        setRequests(response.data.requests);
      } else {
        setError("Failed to fetch requests");
      }
    } catch (err) {
      setError(err.message || "Error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      setUpdating((prev) => ({ ...prev, [requestId]: true }));
      const response = await axios.put(
        `http://localhost:8070/stock/request/${requestId}`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        // Update the local state with the new status
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === requestId
              ? { ...request, status: newStatus }
              : request
          )
        );
      } else {
        setError("Failed to update status");
      }
    } catch (err) {
      setError(err.message || "Error updating status");
    } finally {
      setUpdating((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="stock-requests-container">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-requests-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button className="update-button" onClick={fetchRequests}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-requests-container">
      <div className="stock-requests-header">
        <h1>Stock Requests</h1>
      </div>

      {requests.length === 0 ? (
        <div className="no-requests">
          <p>No stock requests found</p>
        </div>
      ) : (
        <div className="stock-requests-grid">
          {requests.map((request) => (
            <div key={request._id} className="stock-request-card">
              <div className="request-header">
                <span className="request-id">
                  Request #{request._id.slice(-6)}
                </span>
                <span className={`request-status status-${request.status}`}>
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </span>
              </div>

              <div className="request-details">
                <div className="request-detail-item">
                  <span className="request-detail-label">Product:</span>
                  <span className="request-detail-value">
                    {request.product_id?.pr_name || "Unknown Product"}
                  </span>
                </div>
                <div className="request-detail-item">
                  <span className="request-detail-label">Quantity:</span>
                  <span className="request-detail-value">
                    {request.quantity}
                  </span>
                </div>
                <div className="request-detail-item">
                  <span className="request-detail-label">Requested Date:</span>
                  <span className="request-detail-value">
                    {formatDate(request.requested_date)}
                  </span>
                </div>
                <div className="request-detail-item">
                  <span className="request-detail-label">Created:</span>
                  <span className="request-detail-value">
                    {formatDate(request.created_at)}
                  </span>
                </div>
              </div>

              <div className="status-update-form">
                <select
                  className="status-select"
                  value={request.status}
                  onChange={(e) =>
                    handleStatusUpdate(request._id, e.target.value)
                  }
                  disabled={updating[request._id]}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  className="update-button"
                  disabled={updating[request._id]}
                >
                  {updating[request._id] ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StockRequests;
