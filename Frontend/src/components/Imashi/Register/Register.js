import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();

  // State to track user input
  const [user, setUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  // Error state for password match validation
  const [errors, setErrors] = useState({
    passwordMatch: false,
  });

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));

    // Validate password match in real-time
    if (name === "password" || name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        passwordMatch: name === "confirmPassword" && user.password !== value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (user.password !== user.confirmPassword) {
      setErrors({ passwordMatch: true });
      return;
    }

    try {
      // Make a POST request to the backend
      const response = await axios.post("http://localhost:8070/users/register", {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "", // Optional field
        password: user.password,
        confirmPassword: user.confirmPassword, // For backend validation
      });

      // Handle success response
      if (response.status === 200 || response.status === 201) {
        alert("Registration successful! Please log in using your registered credentials.");
        navigate("/User/login"); // Redirect to the login page
      }
    } catch (error) {
      // Handle errors from backend
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="login-bg-art">
      <div className="login-card-modern">
        <div className="login-form-side">
          <h1>Create Account</h1>
          <div className="login-form-subtitle">Please fill in your details to register</div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="login-form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={handleInputChange}
                className="login-form-control"
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="firstName" className="login-form-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={user.firstName}
                onChange={handleInputChange}
                className="login-form-control"
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="login-form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={user.lastName}
                onChange={handleInputChange}
                className="login-form-control"
                placeholder="Enter your last name"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="login-form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                className="login-form-control"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="login-form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={user.phone}
                onChange={handleInputChange}
                className="login-form-control"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="login-form-label">
                Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={user.password}
                  onChange={handleInputChange}
                  className="login-form-control"
                  placeholder="Create a password"
                  required
                  minLength="6"
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

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="login-form-label">
                Confirm Password
              </label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleInputChange}
                  className={`login-form-control ${errors.passwordMatch ? "is-invalid" : ""}`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.passwordMatch && (
                <div className="login-alert-danger">Passwords do not match</div>
              )}
            </div>

            <button type="submit" className="login-btn-primary">
              Create Account
            </button>

            <div className="login-signup-row">
              Already have an account?
              <a href="/User/login">Sign in</a>
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

export default Register;
