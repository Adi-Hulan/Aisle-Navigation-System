import React, { useState, useEffect } from "react";
import "./Asiri.css";
import Nav from "./Nav/NavAsiri";

function RequestStock() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchRequests();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8070/product");
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      const productsArray = Array.isArray(data) ? data : data.products || [];
      setProducts(productsArray);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage({
        type: "error",
        text: "Failed to fetch products. Please try again later.",
      });
      setProducts([]);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch("http://localhost:8070/stock/requests");
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      const data = await response.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Validate inputs
    if (!selectedProduct || !quantity || !requestedDate) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields",
      });
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting request with data:', {
        product_id: selectedProduct,
        quantity: parseInt(quantity),
        requested_date: requestedDate,
        req_by: "65f1a1b2c3d4e5f6g7h8i9j0", // Temporary user ID, replace with actual user ID
      });

      const response = await fetch("http://localhost:8070/stock/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: selectedProduct,
          quantity: parseInt(quantity),
          requested_date: requestedDate,
          req_by: "65f1a1b2c3d4e5f6g7h8i9j0", // Temporary user ID, replace with actual user ID
        }),
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Stock request submitted successfully!",
        });
        setSelectedProduct("");
        setQuantity("");
        setRequestedDate("");
        // Refresh the requests list
        fetchRequests();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to submit stock request. Please try again.",
        });
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#f44336';
      case 'completed':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  return (
    <div className="stock-request-container">
      <Nav />
      <form className="stock-request-form" onSubmit={handleSubmit}>
        <h1 className="request-title">Request Stock</h1>
        <p className="request-subtitle">
          Fill out the form below to request additional stock for a product.
        </p>

        {message.text && (
          <div className={`form-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="product">Select Product</label>
          <select
            id="product"
            className="form-input"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
          >
            <option value="">Choose a product...</option>
            {Array.isArray(products) && products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.pr_name || "Unnamed Product"} - {product._id || "No Code"}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            className="form-input"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="requestedDate">Requested Date</label>
          <input
            type="date"
            id="requestedDate"
            className="form-input"
            value={requestedDate}
            onChange={(e) => setRequestedDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? (
            <div className="asiri-spinner"></div>
          ) : (
            <>
              Submit Request
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Requests Table */}
      <div className="requests-table-container">
        <h2 className="requests-title">Stock Requests</h2>
        <div className="table-responsive">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Requested Date</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>{request.product_id?.pr_name || 'Unknown Product'}</td>
                  <td>{request.quantity}</td>
                  <td>{new Date(request.requested_date).toLocaleDateString()}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>{new Date(request.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RequestStock;
