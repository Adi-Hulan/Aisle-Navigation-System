import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../Nav/NavKasun";
import { Link } from "react-router-dom";


const URL = "http://localhost:8070/product";

const fetchHandler = async (searchQuery) => {
  return await axios
    .get(URL, { params: { query: searchQuery } }) // Sending search query to the backend
    .then((res) => res.data.products);
};


// Description Section Component
const DescriptionSection = () => {
  return (
    <section className="description-section">
      <div className="description-container">
        <h2 className="section-title">Welcome to Shelf Scout</h2>
        <p className="section-subtitle">
        "Shop smarter and faster with our intelligent product locator that eliminates wasted time searching for items."
        </p>

        <div className="description-grid">
          <div className="description-item">
            <div className="description-icon">🧭</div>
            <h3 className="description-title">Smart Aisle Navigation</h3>
            <p className="description-text">
            Find products fast with Shelf Scout your smart aisle mapper for the quickest shopping route.
            </p>
          </div>

          <div className="description-item">
            <div className="description-icon">🛒</div>
            <h3 className="description-title">Personalized Shopping Experience</h3>
            <p className="description-text">
            Get personalized recommendations and custom routes based on your shopping habits with Shelf Scout.
            </p>
          </div>

          <div className="description-item">
            <div className="description-icon">⏱️</div>
            <h3 className="description-title">Real-time Store Updates</h3>
            <p className="description-text">
            Get  updates on store changes,product moves, new arrivals so your navigation stays accurate with ShelfScout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};


// Product Card Component
const ProductCard = ({ product }) => {
  // Safely check if price exists and is a valid number before applying .toFixed(2)
  const formattedPrice = product.price && !isNaN(product.price) ? product.price.toFixed(2) : "N/A";
  
  return (
    <div className="product-card">
      <div className="product-image-container"><img src={product.image} alt={product.name} className="product-image" /></div>
        <div className="product-details">
        <h3 className="product-name">{product.pr_name}</h3>
        <p className="product-brand">{product.description}</p>
        <p className="product-category">{product.cat_id}</p>
        <p className="product-barcode"><strong>Barcode:</strong>{product.barcode}</p>
        <p className="product-barcode"><strong>Promotion:</strong>{product.promotions}</p>
        <div className="product-location"><strong>Expire Date:</strong> {product.exp_date}</div>
        <div className="product-stock"><strong>In Stock:</strong> {product.stock} units</div>
        <div className="product-footer"><span className="product-price">Rs.{product.unit_price}</span>
        <button className="add-to-cart-btn">{product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Product Carousel Component
const ProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselItems = [
    {
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3",
      title: "Featured Categories",
      description: "Explore our wide range of product categories"
    },
    {
      image: "https://images.unsplash.com/photo-1534723570441-4c448d1010e5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Organic Products",
      description: "Discover our selection of fresh organic products"
    },
    {
      image: "https://images.unsplash.com/photo-1584680226833-0d680d0a0794?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Fresh Arrivals",
      description: "Check out our latest product additions"
    },
    {
      image: "https://images.unsplash.com/photo-1601599963565-b7ba29c8e3ff?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Special Offers",
      description: "Don't miss out on our current promotions"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="product-carousel-section">
      
      <div className="carousel-container">
        <button className="carousel-button prev" onClick={prevSlide}>
          ←
        </button>
        <div 
          className="carousel"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselItems.map((item, index) => (
            <div key={index} className="carousel-item">
              <img src={item.image} alt={item.title} className="carousel-image" />
              <div className="carousel-content">
                <h3 className="carousel-title">{item.title}</h3>
                <p className="carousel-description">{item.description}</p>
                <button className="carousel-cta">Explore Now</button>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-button next" onClick={nextSlide}>
          →
        </button>
        <div className="carousel-dots">
          {carouselItems.map((_, index) => (
            <div
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
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
            <Link to={`/Frontend/src/Components/Feedback/Feedback.js`} style={{ marginRight: "10px", textDecoration: "none", color: "blue" }}>Feedback</Link>
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

// Main ShelfScout Component
const GuestHome = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch products and categories when the page loads
  useEffect(() => {
    fetchHandler("").then((data) => {
      setProducts(data);
      setFilteredProducts(data);
      const uniqueCategories = [
        ...new Set(data.map((product) => product.cat_id.name)), // Assuming category has 'name'
      ];
      setCategories(uniqueCategories);
    });
  }, []);

  // Search Handler
  const handleSearch = () => {
    const filtered = products.filter((product) =>
      Object.values(product).some((field) =>
        field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredProducts(filtered);
    setNoResults(filtered.length === 0);
  };

  return (
    <div className="shelfscout-container">
      <Nav/>

      <ProductCarousel />
      {/* Description Section */}
      <DescriptionSection />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Nearby Products</h1>
          <p className="hero-subtitle">
            Explore top-rated products, find them in-store, and shop smarter!
          </p>

          <div className="search-container">
            <input
              type="text"
              className="search-bar"
              placeholder="What are you looking for?"
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery as user types
            />

            {/* Dynamic Category Dropdown */}
            <select className="category-select">
              <option value="">Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button onClick={handleSearch} className="search-button">
              Search
            </button>
          </div>
        </div>
      </section>


      {/* Search Results */}
      <div className="search-results">
        <h3>
          {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
        </h3>
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>

      {/* Product Carousel */}
     

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GuestHome;
