import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });

  useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  const handleUpdate = () => {
    onUpdate(editedProduct);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      onDelete(product._id);
    }
  };

  return (
    <div className="product-card">
      {isEditing ? (
        <div className="product-card-edit">
          <input
            type="text"
            name="pr_name"
            value={editedProduct.pr_name}
            onChange={handleChange}
            className="product-input"
            placeholder="Product Name"
          />
          <input
            type="number"
            name="unit_price"
            value={editedProduct.unit_price}
            onChange={handleChange}
            className="product-input"
            placeholder="Price"
          />
          <input
            type="number"
            name="quantity"
            value={editedProduct.quantity}
            onChange={handleChange}
            className="product-input"
            placeholder="Quantity"
          />
          <div className="product-card-actions">
            <button className="save-btn" onClick={handleUpdate}>
              <FaSave /> Save
            </button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="product-card-content">
          <h3 className="product-name">{product.pr_name || "Unnamed Product"}</h3>
          <div className="product-details">
            <p className="product-id">ID: {product._id?.slice(-6) || "N/A"}</p>
            <p className="product-price">Rs. {product.unit_price || "N/A"}</p>
            <p className="product-quantity">Quantity: {product.quantity || "N/A"}</p>
            <p className="product-date">
              Added: {product.added_on
                ? new Date(product.added_on).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
          <div className="product-card-actions">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
