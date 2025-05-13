import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";

function Header() {
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/products/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Search response:", data);
      setSearchResults(data.products || []);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleResultClick = (productId) => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    navigate(`/product/${productId}`); // Redirect to the product details page
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleResultClick(searchResults[0]._id);
    }
  };

  const handleLogout = () => {
    // Remove user from storage
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <span className="brand-text">Inventory System</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => navigate("/inventory/inventorydashboard")}
              >
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => navigate("/inventory/inventorypage")}
              >
                Inventory
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Pricing
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Promotions
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => navigate("/inventory/supReq")}
              >
                Supplier Orders
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => navigate("/inventory/stockReq")}
              >
                Stock Orders
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Reports
              </a>
            </li>
          </ul>
          <div className="position-relative me-2">
            <form
              className="d-flex search-form"
              role="search"
              onSubmit={handleSearchSubmit}
            >
              <input
                className="form-control me-2 search-input"
                type="search"
                placeholder="Search products..."
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button className="btn search-btn" type="submit">
                <i className="fas fa-search"></i> Search
              </button>
            </form>
            {showResults && searchResults.length > 0 && (
              <ul
                className="list-group position-absolute"
                style={{
                  zIndex: 1000,
                  width: "100%",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {searchResults.map((product) => (
                  <li
                    key={product._id}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleResultClick(product._id)}
                  >
                    {product.pr_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="d-flex align-items-center">
            {user ? (
              <button className="btn btn-danger ms-2" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
