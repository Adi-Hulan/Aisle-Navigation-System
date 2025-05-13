import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { useAuthContext } from "../../../hooks/useAuthContext";

function GuestNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <nav className="grocery-nav">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <h1>FreshMart</h1>
        </Link>

        {/* Search Bar */}
        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for groceries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>

        {/* Navigation Links */}
        <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <Link to="/categories/fruits" className="nav-link">
            Fruits
          </Link>
          <Link to="/categories/vegetables" className="nav-link">
            Vegetables
          </Link>
          <Link to="/categories/dairy" className="nav-link">
            Dairy
          </Link>
          <Link to="/categories/bakery" className="nav-link">
            Bakery
          </Link>
        </div>

        {/* Auth Buttons and Cart */}
        <div className="nav-actions">
          <Link to="/cart" className="nav-cart">
            <FaShoppingCart />
            <span className="cart-count">0</span>
          </Link>
          <div className="nav-auth">
            {user ? (
              <button onClick={handleLogout} className="nav-logout">
                Logout
              </button>
            ) : (
              <>
                <Link to="/User/login" className="nav-login">
                  Login
                </Link>
                <Link to="/User/register" className="nav-register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
}

export default GuestNav;
