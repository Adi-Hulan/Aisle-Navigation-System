import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProductDetails() {
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
          `http://localhost:8070/product/${productId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Updated: check for `product`, not `products`
        if (!data.product) {
          throw new Error("Product not found");
        }

        console.log(data.product);
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
          <h5 className="card-title">{product.pr_name}</h5>
          <p className="card-text">
            <strong>Description:</strong>{" "}
            {product.description || "No description available"}
          </p>
          <p className="card-text">
            <strong>Category ID:</strong>{" "}
            {product.cat_id ? product.cat_id.toString() : "N/A"}
          </p>
          <p className="card-text">
            <strong>Barcode:</strong> {product.barcode || "N/A"}
          </p>
          <p className="card-text">
            <strong>Unit Price:</strong> ${product.unit_price.toFixed(2)}
          </p>
          <p className="card-text">
            <strong>Status:</strong> {product.is_active ? "Active" : "Inactive"}
          </p>
          <p className="card-text">
            <strong>Added On:</strong> {formatDate(product.added_on)}
          </p>
          <p className="card-text">
            <strong>Supplier ID:</strong>{" "}
            {product.supplier_id ? product.supplier_id.toString() : "N/A"}
          </p>
          <p className="card-text">
            <strong>Expiration Date:</strong> {formatDate(product.exp_date)}
          </p>
          <p className="card-text">
            <strong>Promotions:</strong>{" "}
            {product.promotions && product.promotions.length > 0
              ? product.promotions.map((promo) => promo.toString()).join(", ")
              : "No promotions"}
          </p>
        </div>
      </div>
      <button className="btn btn-primary mt-3" onClick={() => navigate("/inventory/productsPage")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default ProductDetails;
