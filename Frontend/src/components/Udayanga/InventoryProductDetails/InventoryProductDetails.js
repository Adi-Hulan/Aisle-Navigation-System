import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const InventoryProductDetails = () => {
  const { productId } = useParams(); // Get the productId from the URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details when the component mounts
  useEffect(() => {
    const fetchProductDetails = async () => {
      console.log(productId);
      try {
        setLoading(true);
        console.log("Fetching product for:", productId);
        const response = await fetch(
          `http://localhost:8070/inventory/${productId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Updated: check for `product`, not `products`
        if (!data.inventory) {
          throw new Error("Product not found");
        }

        console.log(data.inventory);
        setProduct(data.inventory);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Re-fetch if productId changes

  // Handle loading state
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center mt-5">
        <h5>Error: {error}</h5>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Handle case where product is not found
  if (!product) {
    return (
      <div className="text-center mt-5">
        <h5>Product not found</h5>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Format dates for display
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
  };

  // Render product details
  return (
    <div className="container mt-5">
      <h2>Product Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{product.product_name}</h5>
          <p className="card-text">
            <strong>Current Stock:</strong>{" "}
            {product.current_stock || "No description available"}
          </p>
          <p className="card-text">
            <strong>Category Name:</strong>{" "}
            {product.cat_id ? product.cat_name : "N/A"}
          </p>
          <p className="card-text">
            <strong>Min Qunatity:</strong> {product.min_quan || "N/A"}
          </p>
          <p className="card-text">
            <strong>Max Qunatity:</strong> {product.max_quan || "N/A"}
          </p>
          <p className="card-text">
            <strong>Status:</strong> {product.is_active ? "Active" : "Inactive"}
          </p>
          <p className="card-text">
            <strong>Last Updated:</strong> {formatDate(product.last_updated)}
          </p>
        </div>
      </div>
      <button className="btn btn-primary mt-3" onClick={() => navigate("/inventory/inventorypage")}>
        Back to Inventory Page
      </button>
    </div>
  );
};
