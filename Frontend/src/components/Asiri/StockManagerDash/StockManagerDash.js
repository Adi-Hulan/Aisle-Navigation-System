import React, { useState, useEffect } from "react";
import Nav from "../Nav/NavAsiri";
import axios from "axios";
import ProductCard from "../Products/ProductCard";
import {
  FaPlus,
  FaBox,
  FaExclamationTriangle,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import "../Asiri.css";

const fetchHandler = async () => {
  try {
    const response = await axios.get("http://localhost:8070/stock/get");
    console.log("Fetched products:", response.data);
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
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: 0,
    min_qty: 0,
    max_qty: 1000,
    location: {
      aisle_number: 1,
      shelf_number: 1,
      row_number: 1,
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8070/product");
        // Make sure we're getting the array of products from the response
        const productsArray = response.data.products || response.data || [];
        console.log("Fetched products:", productsArray);
        setProducts(Array.isArray(productsArray) ? productsArray : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to load products list");
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: Number(value),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
        {" "}
        <div className="form-group">
          <label>Select Product:</label>
          <select
            name="product_id"
            value={formData.product_id}
            onChange={handleInputChange}
            required
            className="form-control"
          >
            <option value="">Select a product...</option>{" "}
            {Array.isArray(products) &&
              products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.pr_name || "Unnamed Product"} -{" "}
                  {product._id || "No Code"}
                </option>
              ))}
          </select>
        </div>{" "}
        <div className="form-group">
          <label>Aisle Number:</label>
          <input
            type="number"
            name="location.aisle_number"
            value={formData.location.aisle_number}
            onChange={handleInputChange}
            required
            min="1"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Shelf Number:</label>
          <input
            type="number"
            name="location.shelf_number"
            value={formData.location.shelf_number}
            onChange={handleInputChange}
            required
            min="1"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Row Number:</label>
          <input
            type="number"
            name="location.row_number"
            value={formData.location.row_number}
            onChange={handleInputChange}
            required
            min="1"
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
  const filteredProducts = products.filter(
    (product) =>
      String(product.product_id || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(product.location?.aisle_number || "").includes(searchTerm) ||
      String(product.location?.shelf_number || "").includes(searchTerm) ||
      String(product.location?.row_number || "").includes(searchTerm)
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
                <p>{products.filter((p) => p.quantity <= p.min_qty).length}</p>
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
