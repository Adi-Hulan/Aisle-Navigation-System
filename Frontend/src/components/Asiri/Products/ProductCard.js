import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaBox, 
  FaWarehouse, 
  FaExclamationTriangle,
  FaChartLine,
  FaCalendarAlt,
  FaBoxes,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import '../Asiri.css';

function ProductCard({ product, onUpdate, onDelete }) {
  const {
    _id,
    product_id,
    shelf_id,
    quantity,
    min_qty,
    max_qty,
    last_update,
    pr_name,
  } = product;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    quantity,
    min_qty,
    max_qty,
    shelf_id,
  });
  const navigate = useNavigate();

  const productName = product_id?.name || "Unknown Product";
  const qty = formData.quantity;
  const minqty = formData.min_qty;
  const low = qty < minqty;
  const stockPercentage = (qty / max_qty) * 100;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8070/stock/${_id}`,
        formData
      );

      if (response.status === 200) {
        setIsEditing(false);
        onUpdate();
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert(
        "Failed to update product: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this product from stock?")
    ) {
      try {
        await axios.delete(`http://localhost:8070/stock/${_id}`);
        onDelete();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  return (
    <div className={`product-card ${low ? 'low-stock' : ''}`}>
      <div className="product-card-header">
        <div className="product-title">
          <FaBox className="product-icon" />
          <h2>{product_id ? product_id.pr_name : "Unknown Product"}</h2>
        </div>
        {low && (
          <div className="low-stock-badge">
            <FaExclamationTriangle />
            Low Stock
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="product-card-edit">
          <div className="edit-form">
            <div className="form-group">
              <label>
                <FaWarehouse className="input-icon" />
                Shelf Location
              </label>
              <input
                type="text"
                name="shelf_id"
                value={formData.shelf_id}
                onChange={handleInputChange}
                placeholder="Enter shelf location"
              />
            </div>
            <div className="form-group">
              <label>
                <FaBoxes className="input-icon" />
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                placeholder="Enter quantity"
              />
            </div>
            <div className="form-group">
              <label>
                <FaArrowDown className="input-icon" />
                Minimum Quantity
              </label>
              <input
                type="number"
                name="min_qty"
                value={formData.min_qty}
                onChange={handleInputChange}
                min="0"
                placeholder="Enter minimum quantity"
              />
            </div>
            <div className="form-group">
              <label>
                <FaArrowUp className="input-icon" />
                Maximum Quantity
              </label>
              <input
                type="number"
                name="max_qty"
                value={formData.max_qty}
                onChange={handleInputChange}
                min={formData.min_qty}
                placeholder="Enter maximum quantity"
              />
            </div>
          </div>
          <div className="button-group">
            <button className="btn-save" onClick={handleUpdate}>
              <FaSave /> Save Changes
            </button>
            <button className="btn-cancel" onClick={() => setIsEditing(false)}>
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="product-card-content">
          <div className="product-main-info">
            <div className="stock-level">
              <div className="stock-header">
                <span className="stock-label">Stock Level</span>
                <span className="stock-value">{quantity} / {max_qty}</span>
              </div>
              <div className="stock-bar">
                <div 
                  className="stock-fill" 
                  style={{ width: `${stockPercentage}%` }}
                />
              </div>
              <span className="stock-percentage">{stockPercentage.toFixed(0)}%</span>
            </div>
            
            <div className="location-info">
              <FaWarehouse className="location-icon" />
              <span className="location-text">{shelf_id}</span>
            </div>
          </div>

          <div className="product-details">
            <div className="detail-item">
              <span className="detail-label">
                <FaArrowDown className="detail-icon" />
                Min Qty
              </span>
              <span className="detail-value">{min_qty}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <FaArrowUp className="detail-icon" />
                Max Qty
              </span>
              <span className="detail-value">{max_qty}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <FaCalendarAlt className="detail-icon" />
                Updated
              </span>
              <span className="detail-value">
                {last_update
                  ? new Date(last_update).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="button-group">
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Stock
            </button>
            <button className="btn-delete" onClick={handleDelete}>
              <FaTrash /> Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
