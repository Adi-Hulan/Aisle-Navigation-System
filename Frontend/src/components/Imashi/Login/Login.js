import React, { useState } from "react";
import Nav from "../Nav/NavImashi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../../../hooks/useAuthContext";

function Login() {
  const {dispatch} = useAuthContext()
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post(
        "http://localhost:8070/users/login",
        credentials
      );
  
      if (response.status < 200 || response.status >= 300) {
        setError(response.data?.error || "Login failed. Please try again.");
        return;
      }

      dispatch({ type: "LOGIN", payload: response.data.user });

      const userRole = response.data.user?.role;
      
      switch(userRole) {
        case 'admin':
          navigate("/User/userdetails");
          break;
        case 'stockManager':
          navigate("/stock/StockManagerDash");
          break;
        case 'inventoryManager':
          navigate("/inventory/inventorydashboard");
          break;
        case 'customer':
          navigate("/website/home");
          break;
        case 'supplier':
          navigate("/supplier/supplierhome");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      setError(
        error.response?.data?.error || "An error occurred. Please try again later."
      );
    }
  };

  return (
    <div className="login-bg-art">
      <div className="login-card-modern">
        <div className="login-form-side">
          <h1>Welcome Back</h1>
          <div className="login-form-subtitle">Please enter your details to sign in</div>
          
          {error && <div className="login-alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="login-form-label">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={credentials.email}
                onChange={handleInputChange}
                className="login-form-control"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="login-form-label">
                Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="login-form-control"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <a href="#" className="login-forgot">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn-primary">
              Sign In
            </button>

            <div className="login-signup-row">
              Don't have an account?
              <a href="/User/register">Sign up</a>
            </div>
          </form>
        </div>
        <div className="login-image-side">
          <img 
            src="https://images.unsplash.com/photo-1601600576337-c1d8a0d1373c?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Shopping experience" 
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
