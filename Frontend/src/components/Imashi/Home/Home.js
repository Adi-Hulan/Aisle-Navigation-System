import React from "react";
import Nav from "../Nav/NavImashi";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="landing-page">
      <Nav />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Asiri</h1>
          <p className="hero-subtitle">Your One-Stop Solution for Quality Products</p>
          <div className="hero-buttons">
            <Link to="/User/register" className="btn-primary">Get Started</Link>
            <Link to="/website/products" className="btn-secondary">Explore Products</Link>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1470&auto=format&fit=crop" 
            alt="Shopping experience" 
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>Quick and reliable delivery to your doorstep</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Quality Products</h3>
            <p>Carefully selected items for your needs</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Best Prices</h3>
            <p>Competitive prices and great deals</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Secure Shopping</h3>
            <p>Safe and secure payment options</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          <div className="category-card">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1399&auto=format&fit=crop" alt="Electronics" />
            <h3>Electronics</h3>
          </div>
          <div className="category-card">
            <img src="https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1364&auto=format&fit=crop" alt="Fashion" />
            <h3>Fashion</h3>
          </div>
          <div className="category-card">
            <img src="https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1364&auto=format&fit=crop" alt="Home & Living" />
            <h3>Home & Living</h3>
          </div>
          <div className="category-card">
            <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1480&auto=format&fit=crop" alt="Accessories" />
            <h3>Accessories</h3>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Amazing service and quality products. Will definitely shop again!"</p>
            </div>
            <div className="testimonial-author">
              <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="Customer" />
              <div>
                <h4>Sarah Johnson</h4>
                <p>Regular Customer</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Fast delivery and excellent customer support. Highly recommended!"</p>
            </div>
            <div className="testimonial-author">
              <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Customer" />
              <div>
                <h4>Michael Brown</h4>
                <p>Verified Buyer</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Great prices and wide selection of products. Very satisfied!"</p>
            </div>
            <div className="testimonial-author">
              <img src="https://randomuser.me/api/portraits/women/2.jpg" alt="Customer" />
              <div>
                <h4>Emily Davis</h4>
                <p>Loyal Customer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Shopping?</h2>
          <p>Join thousands of satisfied customers today</p>
          <Link to="/User/register" className="btn-primary">Sign Up Now</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>Your trusted online shopping destination for quality products and excellent service.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/website/products">Products</Link></li>
              <li><Link to="/User/login">Login</Link></li>
              <li><Link to="/User/register">Register</Link></li>
              <li><Link to="/website/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Info</h3>
            <p>Email: info@asiri.com</p>
            <p>Phone: +94 11 234 5678</p>
            <p>Address: Colombo, Sri Lanka</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Asiri. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
