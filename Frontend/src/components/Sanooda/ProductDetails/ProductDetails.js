import React, { useState, useEffect } from "react";
import Nav from "../Nav/NavSanooda";
import axios from "axios";
import { FaBox, FaSearch, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

const URL = "http://localhost:8070/supplier-product";

const fetchProducts = async () => {
  try {
    const res = await axios.get(URL);
    console.log("Fetched products:", res.data.products); // Debug log
    return res.data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

function ProductDetails() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      setError("");

      const data = await fetchProducts();
      console.log("Setting products:", data); // Debug log
      setProducts(data);
      setLoading(false);
    };

    getProducts();
  }, []);
  const handleUpdate = async (updatedProduct) => {
    try {
      const { _id, Product_name, quantity, price } = updatedProduct;
      console.log("Updating product with data:", {
        Product_name,
        quantity,
        price,
      }); // Debug log

      const response = await axios.put(`${URL}/${_id}`, {
        Product_name,
        quantity,
        price,
      });

      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === _id
              ? { ...product, Product_name, quantity, price }
              : product
          )
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product.");
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${URL}/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p._id !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product.");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    console.log("Search query:", query); // Debug log
    setSearchQuery(query);
  };

  const filteredProducts = products.filter((product) => {
    console.log("Filtering product:", product); // Debug log
    return (
      product &&
      product.Product_name &&
      product.Product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  console.log("Filtered products:", filteredProducts); // Debug log

  return (
    <div className="page-wrapper">
      <Nav />

      <div className="products-page">
        <div className="products-container">
          <div className="section-header">
            <div className="header-content">
              <h1>
                <FaBox className="header-icon" /> Product Details
              </h1>
              <p>Manage your product inventory</p>
            </div>
            <button
              className="add-product-btn"
              onClick={() => navigate("/addproduct")}
            >
              <FaPlus className="button-icon" /> Add New Product
            </button>
          </div>

          <div className="search-container">
            <div className="search-wrapper">
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="search-bar"
                />
                <button className="search-button">
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No products found.</p>
              {searchQuery && (
                <button
                  className="view-all-btn"
                  onClick={() => setSearchQuery("")}
                >
                  View All Products
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
