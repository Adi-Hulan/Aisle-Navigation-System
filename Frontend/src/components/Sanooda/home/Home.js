import React, { useState, useEffect } from "react";
import Nav from "../Nav/NavSanooda";
import { FaClipboardList, FaCheck, FaTimes, FaBox } from 'react-icons/fa';

function Home() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8070/supplier/requests');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data.requests || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to update order status
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8070/supplier/requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus.toLowerCase() })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Refresh the orders list after successful update
      fetchOrders();
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <Nav />
        <div className="order-management-page">
          <div className="order-management-container">
            <div className="loading-state">Loading orders...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <Nav />
        <div className="order-management-page">
          <div className="order-management-container">
            <div className="error-message">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Nav />
      
      <div className="order-management-page">
        <div className="order-management-container">
          <div className="order-header">
            <h1><FaClipboardList className="header-icon" /> Order Management</h1>
            <p>Manage and track your inventory orders</p>
          </div>

          <div className="order-stats">
            <div className="stat-card">
              <FaBox className="stat-icon" />
              <div className="stat-info">
                <h3>Total Orders</h3>
                <p>{orders.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <FaCheck className="stat-icon" />
              <div className="stat-info">
                <h3>Accepted</h3>
                <p>{orders.filter(order => order.status === "approved").length}</p>
              </div>
            </div>
            <div className="stat-card">
              <FaTimes className="stat-icon" />
              <div className="stat-info">
                <h3>Declined</h3>
                <p>{orders.filter(order => order.status === "rejected").length}</p>
              </div>
            </div>
          </div>

          <div className="order-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-info">
                  <div className="order-header">
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <span className={`order-status ${
                      order.status === 'approved' ? 'status-accepted' : 
                      order.status === 'rejected' ? 'status-declined' : 
                      'status-pending'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="order-details">
                    <FaBox className="order-icon" />
                    <p>{order.item} - Quantity: {order.qty}</p>
                  </div>
                </div>
                <div className="order-actions">
                  <button
                    className="accept-btn"
                    onClick={() => updateStatus(order._id, "approved")}
                    disabled={order.status !== "pending"}
                  >
                    <FaCheck /> Accept
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() => updateStatus(order._id, "rejected")}
                    disabled={order.status !== "pending"}
                  >
                    <FaTimes /> Decline
                  </button>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="no-orders">
                <p>No orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
