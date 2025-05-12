import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "./Nav/NavImashi";
import { FaArrowLeft, FaBox, FaBarcode, FaDollarSign, FaCalendarAlt, FaTag, FaUser, FaInfoCircle } from "react-icons/fa";
import './Imashi.css';

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8070/product/${productId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (!data.product) {
          throw new Error("Product not found");
        }

        setProduct(data.product);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <div className="imashi-page-wrapper">
        <Nav />
        <div className="imashi-container">
          <div className="imashi-loading">
            <FaBox className="imashi-spinner" />
            <p>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="imashi-page-wrapper">
        <Nav />
        <div className="imashi-container">
          <div className="imashi-message imashi-message-error">
            <FaInfoCircle />
            <p>Error: {error}</p>
            <button 
              className="imashi-btn imashi-btn-primary"
              onClick={() => navigate("/inventory/productsPage")}
            >
              <FaArrowLeft /> Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="imashi-page-wrapper">
        <Nav />
        <div className="imashi-container">
          <div className="imashi-message imashi-message-warning">
            <FaInfoCircle />
            <p>Product not found</p>
            <button 
              className="imashi-btn imashi-btn-primary"
              onClick={() => navigate("/inventory/productsPage")}
            >
              <FaArrowLeft /> Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
  };

  return (
    <div className="imashi-page-wrapper">
      <Nav />
      <div className="imashi-container">
        <div className="imashi-dashboard-header">
          <div className="imashi-header-content">
            <h1><FaBox className="imashi-header-icon" /> Product Details</h1>
            <p>View detailed information about {product.pr_name}</p>
          </div>
          <button 
            className="imashi-btn imashi-btn-secondary"
            onClick={() => navigate("/inventory/productsPage")}
          >
            <FaArrowLeft /> Back to Products
          </button>
        </div>

        <div className="imashi-section">
          <div className="imashi-card">
            <div className="imashi-user-details-grid">
              <div className="imashi-detail-item">
                <div className="imashi-detail-label">
                  <FaBox /> Product Name
                </div>
                <div className="imashi-detail-value">{product.pr_name}</div>
              </div>

              <div className="imashi-detail-item">
                <div className="imashi-detail-label">
                  <FaInfoCircle /> Description
                </div>
                <div className="imashi-detail-value">
                  {product.description || "No description available"}
                </div>
              </div>

              <div className="imashi-detail-item">
                <div className="imashi-detail-label">
                  <FaBarcode /> Barcode
                </div>
                <div className="imashi-detail-value">{product.barcode || "N/A"}</div>
              </div>

              <div className="imashi-detail-item">
                <div className="imashi-detail-label">
                  <FaDollarSign /> Unit Price
                </div>
                <div className="imashi-detail-value">
                  ${product.unit_price.toFixed(2)}
                </div>
              </div>

              <div className="imashi-detail-item">
                <div className="imashi-detail-label">
                  <FaTag /> Category
                </div>
                <div className="imashi-detail-value">
                  {product.cat_id ? product.cat_id.toString() : "N/A"}
                </div>
              </div>

              <div className="imashi-detail-item">
                <div className="imashi-detail-label">
                  <FaUser /> Supplier
                </div>
                <div className="imashi-detail-value">
                  {product.supplier_id ? product.supplier_id.toString() : "N/A"}
                </div>
              </div>

              <div className="imashi-detail-item">
                <div className="imashi-detail-label">
                  <FaCalendarAlt /> Added On
                </div>
                <div className="imashi-detail-value">{formatDate(product.added_on)}</div>
              </div>

              <div className="imashi-detail-item">
                <div className="imashi-detail-label">
                  <FaCalendarAlt /> Expiration Date
                </div>
                <div className="imashi-detail-value">{formatDate(product.exp_date)}</div>
              </div>

              <div className="imashi-detail-item">
                <div className="imashi-detail-label">
                  <FaTag /> Promotions
                </div>
                <div className="imashi-detail-value">
                  {product.promotions && product.promotions.length > 0
                    ? product.promotions.map((promo) => promo.toString()).join(", ")
                    : "No promotions"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails; 