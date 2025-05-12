import React, { useState, useEffect } from "react";
import Nav from "../Nav/NavAsiri";
import axios from "axios";
import ProductCard from "../Products/ProductCard";
import { FaPlus, FaBox, FaExclamationTriangle, FaTimes, FaSearch } from "react-icons/fa";
import '../Asiri.css';

const fetchHandler = async () => {
  try {
    const response = await axios.get("http://localhost:8070/stock/get");
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

// Popup Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        {children}
      </div>
    </div>
  );
};

// Add Product Form Component
const AddProductForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    product_id: "",
    shelf_id: "",
    quantity: 0,
    min_qty: 0,
    max_qty: 1000,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8070/stock/add", formData);
      onSuccess(); // Refresh the list
      onCancel(); // Close the form
    } catch (error) {
      console.error("Error adding product:", error);
      alert(
        "Failed to add product: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="add-product-form">
      <h3>Add New Product to Stock</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product ID:</label>
          <input
            type="text"
            name="product_id"
            value={formData.product_id}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Shelf Location:</label>
          <input
            type="text"
            name="shelf_id"
            value={formData.shelf_id}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            required
            min="0"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Minimum Quantity:</label>
          <input
            type="number"
            name="min_qty"
            value={formData.min_qty}
            onChange={handleInputChange}
            min="0"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Maximum Quantity:</label>
          <input
            type="number"
            name="max_qty"
            value={formData.max_qty}
            onChange={handleInputChange}
            min={formData.min_qty}
            className="form-control"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

function StockManagerDash() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchHandler();
      setProducts(data.Products || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = products.filter(product =>
    String(product.product_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(product.shelf_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="asiri-page-wrapper">
        <Nav />
        <div className="asiri-container">
          <div className="asiri-loading">
            <div className="asiri-spinner"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="asiri-page-wrapper">
        <Nav />
        <div className="asiri-container">
          <div className="asiri-error">
            <FaExclamationTriangle />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="asiri-page-wrapper">
      <Nav />
      <div className="asiri-container">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Stock Management</h1>
            <p>Manage your inventory and product stock levels</p>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <FaBox />
              <div className="stat-info">
                <h3>Total Products</h3>
                <p>{products.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <FaExclamationTriangle />
              <div className="stat-info">
                <h3>Low Stock Items</h3>
                <p>{products.filter(p => p.quantity <= p.min_qty).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            className="add-product-button"
            onClick={() => setShowAddForm(true)}
          >
            <FaPlus /> Add New Product
          </button>
        </div>

        <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
          <AddProductForm
            onCancel={() => setShowAddForm(false)}
            onSuccess={fetchData}
          />
        </Modal>

        <div className="products-section">
          <h2>Available Products</h2>
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, i) => (
                <ProductCard
                  key={i}
                  product={product}
                  onUpdate={fetchData}
                  onDelete={fetchData}
                />
              ))
            ) : (
              <div className="no-products">
                <FaBox />
                <p>No products found in stock</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockManagerDash;
