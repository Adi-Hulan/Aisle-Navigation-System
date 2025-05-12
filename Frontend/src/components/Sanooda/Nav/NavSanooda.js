import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaClipboardList, FaPlus, FaBox, FaSignOutAlt } from 'react-icons/fa';

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };
  
  return (
    <nav className="modern-nav">
      <div className="nav-container">
        <a className="nav-logo" href="#" onClick={(e) => {
          e.preventDefault();
          navigate('/supplier/supplierhome');
        }}>
          <FaBox className="nav-icon" />
          <span>Product Manager</span>
        </a>
        
        <div className="nav-links">
          <a 
            className={`nav-link ${isActive('/supplier/supplierhome') ? 'active' : ''}`}
            onClick={() => navigate('/supplier/supplierhome')}
          >
            <FaClipboardList className="nav-icon" />
            <span>Order Details</span>
          </a>

          <a 
            className={`nav-link ${isActive('/supplier/addproducts') ? 'active' : ''}`}
            onClick={() => navigate('/supplier/addproducts')}
          >
            <FaPlus className="nav-icon" />
            <span>Add Product</span>
          </a>

          <a 
            className={`nav-link ${isActive('/supplier/productdetails') ? 'active' : ''}`}
            onClick={() => navigate('/supplier/productdetails')}
          >
            <FaBox className="nav-icon" />
            <span>Product Details</span>
          </a>
        </div>

        <div className="nav-auth">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="nav-icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
