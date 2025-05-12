import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaShoppingCart, FaStar } from "react-icons/fa";

const URL = "http://localhost:8070/product";

const fetchHandler = async (searchQuery) => {
  return await axios
    .get(URL, { params: { query: searchQuery } })
    .then((res) => res.data.products);
};

// Product Card Component
const ProductCard = ({ product }) => {
  const formattedPrice =
    product.unit_price && !isNaN(product.unit_price)
      ? product.unit_price.toFixed(2)
      : "N/A";

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        {product.promotions && (
          <div className="promotion-badge">{product.promotions}</div>
        )}
      </div>
      <div className="product-details">
        <div className="product-header">
          <h3 className="product-name">{product.pr_name}</h3>
          <span className="product-category">
            {product.cat_id ? product.cat_id.cat_name : "Unknown"}
          </span>
        </div>

        <div className="product-description">
          <p>{product.description}</p>
        </div>

        <div className="product-specs">
          <div className="spec-item">
            <span className="spec-label">Barcode</span>
            <span className="spec-value">{product.barcode}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Stock</span>
            <span className={`spec-value ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock} units
            </span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Expiry</span>
            <span className="spec-value">{product.exp_date}</span>
          </div>
        </div>

        <div className="product-footer">
          <div className="price-container">
            <span className="price-label">Price</span>
            <span className="product-price">${formattedPrice}</span>
          </div>
          <button 
            className={`add-to-cart-btn ${product.stock > 0 ? 'available' : 'out-of-stock'}`}
            disabled={product.stock === 0}
          >
            <FaShoppingCart />
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About ShelfScout</h4>
          <p>Your ultimate grocery shopping companion</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Categories</li>
            <li>Account</li>
            <li>Help</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: kasunsanjeewa2002@gmail.com</p>
          <p>Phone: (555) 123-4567</p>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <span>Facebook</span>
            <span>Twitter</span>
            <span>Instagram</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 ShelfScout. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

// Main Products Component
const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHandler("");
        setProducts(data);
        setFilteredProducts(data);
        const uniqueCategories = [
          ...new Set(data.map((product) => product.cat_id?.name || "Uncategorized")),
        ];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = products.filter((product) =>
      Object.values(product).some((field) =>
        field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredProducts(filtered);
    setNoResults(filtered.length === 0);
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-section">
        <div className="section-header">
          <h2>Products</h2>
          <div className="products-count">
            {filteredProducts.length} products found
          </div>
        </div>

        <div className="search-container">
          <div className="search-wrapper">
            <div className="search-input-group">
              <input
                type="text"
                className="search-bar"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch} className="search-button">
                <FaSearch />
              </button>
            </div>
            <select 
              className="category-select"
              onChange={(e) => {
                const category = e.target.value;
                if (category) {
                  const filtered = products.filter(
                    (product) => product.cat_id?.name === category
                  );
                  setFilteredProducts(filtered);
                } else {
                  setFilteredProducts(products);
                }
              }}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {noResults ? (
          <div className="no-results">
            <p>No products found matching your search criteria</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Products;
