import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import GuestNav from "../GuestNav/GuestNav";
import "./SingleProduct.css";

// Add styles for product image
const productImageStyles = {
  imageSection: {
    width: "100%",
    maxWidth: "500px",
    aspectRatio: "1",
    position: "relative",
    overflow: "hidden",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    backgroundColor: "#f5f5f5",
  },
};

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const storeLocation =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d989.3413596598095!2d80.63225916956782!3d7.312780199543449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae367bf37188fd7%3A0xb094b76523d338be!2sKeells%203%20-%20Mahiyawa%20%7C%20Kandy!5e0!3m2!1sen!2slk!4v1746962608993!5m2!1sen!2slk";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/product/${id}`);
        if (response.data.success && response.data.product) {
          setProduct(response.data.product);
        } else {
          setError("Failed to fetch product details");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(
          err.response?.data?.message || "Failed to fetch product details"
        );
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 0)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log("Adding to cart:", { product, quantity });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid Date";
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="single-product-page">
      <GuestNav />

      <div className="product-container">
        <div
          className="product-image-section"
          style={productImageStyles.imageSection}
        >
          <img
            src={
              product.image_url ||
              "https://cnopt.tn/wp-content/uploads/2023/06/default-image.jpg"
            }
            alt={product.pr_name}
            style={productImageStyles.image}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://cnopt.tn/wp-content/uploads/2023/06/default-image.jpg";
            }}
          />
          {product.promotions && product.promotions.length > 0 && (
            <div className="promotion-badge">{product.promotions[0]}</div>
          )}
        </div>

        <div className="product-details-section">
          <h1 className="product-name">{product.pr_name}</h1>

          <div className="product-price">
            <span className="price">Rs. {product.unit_price?.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="original-price">
                Rs. {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || "No description available"}</p>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="label">Category:</span>
              <span className="value">
                {product.cat_id?.cat_name || "Uncategorized"}
              </span>
            </div>
            <div className="meta-item">
              <span className="label">Stock:</span>
              <span className="value">{product.stock || 0} units</span>
            </div>
            <div className="meta-item">
              <span className="label">Expiry Date:</span>
              <span className="value">{formatDate(product.exp_date)}</span>
            </div>
            <div className="meta-item">
              <span className="label">Added On:</span>
              <span className="value">{formatDate(product.added_on)}</span>
            </div>
            <div className="meta-item">
              <span className="label">Barcode:</span>
              <span className="value">{product.barcode || "N/A"}</span>
            </div>
            {product.supplier_id && (
              <div className="meta-item">
                <span className="label">Supplier:</span>
                <span className="value">
                  {product.supplier_id.supplier_name || "N/A"}
                </span>
              </div>
            )}
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={product.stock || 0}
              />
              <button
                onClick={() =>
                  setQuantity((prev) => Math.min(product.stock || 0, prev + 1))
                }
                disabled={quantity >= (product.stock || 0)}
              >
                +
              </button>
            </div>

            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!product.stock || product.stock === 0}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          <div className="product-features">
            <div className="feature">
              <span className="feature-icon">🚚</span>
              <span>Free Delivery</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🔄</span>
              <span>Easy Returns</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💳</span>
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      {(!product.stock || product.stock === 0) && (
        <div className="store-location-section">
          <h3>Visit our store to check availability</h3>
          <div className="map-container">
            <iframe
              src={storeLocation}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Store Location"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
