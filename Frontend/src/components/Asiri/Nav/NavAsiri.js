import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <span className="brand-text"> Stock Management </span>
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
                aria-current="page"
                onClick={() => navigate("/stock/StockManagerDash")}
              >
                Dashboard
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                aria-current="page"
                onClick={() => navigate("/stock/StockRequest")}
              >
                Request
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                aria-current="page"
                onClick={() => navigate("/stock/request")}
              >
                User Details
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
