import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Udayanga.css";
import Nav from "./InventoryHeader/InventoryHeader";

function SupplierReq() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8070/supplier/requests"
      );
      if (response.data.requests) {
        setRequests(response.data.requests);
      } else {
        setError("Failed to fetch supplier requests");
      }
    } catch (err) {
      setError(err.message || "Error fetching supplier requests");
    } finally {
      setLoading(false);
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
        <h1>Supplier Requests</h1>
      </div>

      {requests.length === 0 ? (
        <div className="no-requests">
          <p>No supplier requests found</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Supplier</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Requested Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>#{request._id.slice(-6)}</td>
                  <td>
                    {request.supplierId?.supplier_name || "Unknown Supplier"}
                    <div className="supplier-email">
                      {request.supplierId?.email || "N/A"}
                    </div>
                  </td>
                  <td>{request.item}</td>
                  <td>{request.qty}</td>
                  <td>
                    <span className={`request-status status-${request.status}`}>
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  </td>
                  <td>{formatDate(request.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SupplierReq;
