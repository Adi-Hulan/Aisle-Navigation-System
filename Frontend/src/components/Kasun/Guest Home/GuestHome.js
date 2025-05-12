import React, { useState, useEffect } from "react";
import axios from "axios";
import GuestNav from "../GuestNav/GuestNav";
import { Link, useNavigate } from "react-router-dom";

const URL = "http://localhost:8070/product";

const fetchHandler = async (searchQuery) => {
  return await axios
    .get(`${URL}/withDet`, { params: { query: searchQuery } })
    .then((res) => res.data.products);
};

// Hero Section Component
const HeroSection = ({ onSearch }) => {
  return (
    <section className="grocery-hero">
      <div className="hero-content">
        <h1>Fresh Groceries Delivered</h1>
        <p>Shop from our wide selection of fresh produce, dairy, and household essentials</p>
        <div className="hero-search">
          <input
            type="text"
            placeholder="Search for groceries..."
            onChange={(e) => onSearch(e.target.value)}
          />
          <button className="search-btn">Search</button>
        </div>
      </div>
    </section>
  );
};

// Categories Section
const CategoriesSection = () => {
  const categories = [
    { name: "Fresh Produce", icon: "🥬", color: "#4CAF50" },
    { name: "Dairy & Eggs", icon: "🥛", color: "#2196F3" },
    { name: "Meat & Seafood", icon: "🥩", color: "#f44336" },
    { name: "Bakery", icon: "🍞", color: "#FF9800" },
    { name: "Frozen Foods", icon: "❄️", color: "#9C27B0" },
    { name: "Household", icon: "🏠", color: "#795548" }
  ];

  return (
    <section className="categories-section">
      <h2>Shop by Category</h2>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div 
            key={index} 
            className="category-card"
            style={{ backgroundColor: category.color }}
          >
            <div className="category-content">
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const formattedPrice = product.unit_price && !isNaN(product.unit_price) ? product.unit_price.toFixed(2) : "N/A";
  const formattedExpDate = product.exp_date ? new Date(product.exp_date).toLocaleDateString() : "N/A";
  
  const handleProductClick = () => {
    navigate(`/product/${product._id}`);
  };

  // Get category name with proper error handling
  const getCategoryName = () => {
    if (!product.cat_id) return "Uncategorized";
    return product.cat_id.cat_name || "Uncategorized";
  };
  
  return (
    <div className="grocery-product-card" onClick={handleProductClick} style={{ cursor: 'pointer' }}>
      <div className="product-image">
        <img src={product.image} alt={product.pr_name} />
        {product.promotions && product.promotions.length > 0 && (
          <span className="promotion-badge">{product.promotions[0]}</span>
        )}
      </div>
      <div className="product-info">
        <h3>{product.pr_name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-meta">
          <span className="category">{getCategoryName()}</span>
          <span className="expiry">Expires: {formattedExpDate}</span>
        </div>
        <div className="product-footer">
          <div className="price-stock">
            <span className="price">Rs. {formattedPrice}</span>
            <span className="stock">In Stock: {product.stock || 0}</span>
          </div>
          <button 
            className={`add-to-cart ${product.stock > 0 ? 'available' : 'out-of-stock'}`}
            disabled={product.stock === 0}
            onClick={(e) => {
              e.stopPropagation(); // Prevent navigation when clicking the button
              // TODO: Implement add to cart functionality
            }}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Features Section
const FeaturesSection = () => {
  return (
    <section className="features-section">
      <div className="feature">
        <span className="feature-icon">🚚</span>
        <h3>Free Delivery</h3>
        <p>On orders over $50</p>
      </div>
      <div className="feature">
        <span className="feature-icon">⏰</span>
        <h3>Same Day Delivery</h3>
        <p>Order before 2pm</p>
      </div>
      <div className="feature">
        <span className="feature-icon">🔄</span>
        <h3>Easy Returns</h3>
        <p>30-day return policy</p>
      </div>
      <div className="feature">
        <span className="feature-icon">💳</span>
        <h3>Secure Payment</h3>
        <p>Multiple payment options</p>
      </div>
    </section>
  );
};

// Main Component
const GuestHome = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("price-asc");

  useEffect(() => {
    fetchHandler("").then((data) => {
      console.log(data);
      setProducts(data);
      setFilteredProducts(data);
      // Extract unique categories properly
      const uniqueCategories = [...new Set(data
        .filter(product => product.cat_id && typeof product.cat_id === 'object')
        .map(product => product.cat_id.cat_name)
        .filter(Boolean))];
      setCategories(uniqueCategories);
    });
  }, []);

  // Apply filters whenever search query, category, or sort option changes
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        Object.values(product).some((field) =>
          field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((product) => 
        product.cat_id?.cat_name === selectedCategory
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "price-asc":
        filtered.sort((a, b) => a.unit_price - b.unit_price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.unit_price - a.unit_price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.pr_name.localeCompare(b.pr_name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.pr_name.localeCompare(a.pr_name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, sortOption]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="grocery-website">
      <GuestNav />
      
      <HeroSection onSearch={handleSearch} />
      
      <FeaturesSection />
      
      <CategoriesSection />

      <section className="products-section">
        <div className="section-header">
          <h2>{searchQuery ? `Search Results for "${searchQuery}"` : "Featured Products"}</h2>
          <div className="filters">
            <select 
              className="category-filter"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            <select 
              className="sort-filter"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="no-results">
              <p>No products found</p>
              <button onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
                setSortOption("price-asc");
              }}>View All Products</button>
            </div>
          )}
        </div>
      </section>

      <footer className="modern-footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>About ShelfScout</h3>
            <p>Your trusted grocery shopping destination for quality products and excellent service. We bring fresh groceries right to your doorstep.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/deals">Special Deals</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact Info</h3>
            <ul className="contact-info">
              <li>
                <i className="fas fa-envelope"></i>
                <span>info@shelfscout.com</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <span>(555) 123-4567</span>
              </li>
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
            <div className="newsletter">
              <h4>Subscribe to our newsletter</h4>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button type="submit">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 ShelfScout. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestHome;
