import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane, FaHome, FaShoppingCart, FaUser, FaComments, FaSearch } from 'react-icons/fa';

function ContactUs() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_vde4ojs', 
                'template_fyg6y5k',
                form.current, {
                publicKey: 'aIapX24oUB_Uv543o',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          alert('Email sent successfully')
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert('Email not sent')
        },
      );
  };

  return (
    <div className="contact-page">
      <nav className="modern-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            ShelfScout
          </Link>

          <div className="nav-links">
            <Link to="/" className="nav-link">
              <FaHome className="nav-icon" />
              <span>Home</span>
            </Link>
            <Link to="/products" className="nav-link">
              <FaShoppingCart className="nav-icon" />
              <span>Products</span>
            </Link>
            <Link to="/feedback" className="nav-link">
              <FaComments className="nav-icon" />
              <span>Feedback</span>
            </Link>
            <Link to="/contact" className="nav-link active">
              <FaEnvelope className="nav-icon" />
              <span>Contact</span>
            </Link>
          </div>

          <div className="nav-search">
            <input type="text" placeholder="Search products..." />
            <button type="button">
              <FaSearch />
            </button>
          </div>

          <div className="nav-auth">
            <Link to="/login" className="login-btn">
              <FaUser />
              <span>Login</span>
            </Link>
            <Link to="/signup" className="signup-btn">
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="contact-wrapper">
        <div className="contact-info">
          <div className="info-box">
            <div className="info-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="info-content">
              <h3>Our Location</h3>
              <p>SLIIT Kandy Uni</p>
            </div>
          </div>
          
          <div className="info-box">
            <div className="info-icon">
              <FaPhone />
            </div>
            <div className="info-content">
              <h3>Phone Number</h3>
              <p>234-9876-6400</p>
              <p>888-0123-4567 (Toll Free)</p>
            </div>
          </div>
          
          <div className="info-box">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <div className="info-content">
              <h3>Email Address</h3>
              <p><a href="mailto:kasunsanjeewa2002@gmail.com">kasunsanjeewa2002@gmail.com</a></p>
            </div>
          </div>
        </div>

        <div className="contact-container">
          <div className="contact-header">
            <h1>Get in Touch</h1>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
          
          <form ref={form} onSubmit={sendEmail} className="contact-form">
            <div className="form-group">
              <label>Your Name</label>
              <input 
                type="text" 
                name="user_name" 
                placeholder="Enter your name" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="user_email" 
                placeholder="Enter your email" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Your Message</label>
              <textarea 
                name="message" 
                placeholder="How can we help you?" 
                required 
              />
            </div>
            
            <button type="submit" className="submit-btn">
              <FaPaperPlane className="button-icon" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
