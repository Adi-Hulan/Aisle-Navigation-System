import React, { useState } from "react";
import Nav from "../Nav/NavImashi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { toast, ToastContainer } from "react-toastify";

function AddUser() {
  const {user} = useAuthContext()
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    salary: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendRequest();
      toast.success("User added successfully!", {
        position: "top-right",
        autoClose: 2000, // 2 seconds
      });
      setTimeout(() => {
        history("/User/userdetails");
      }, 2000); // Delay to let user see the message
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error status code:", error.response?.status);
      toast.error(error.response?.data?.message || "Error adding user");
    }
  };
  

  const sendRequest = async () => {
    return await axios.post("http://localhost:8070/users/add", {
      // Changed from /users/add to /user/add
      username: inputs.username,
      firstName: inputs.firstName,
      lastName: inputs.lastName,
      email: inputs.email,
      phone: inputs.phone || "", // Ensure empty string if null
      salary: Number(inputs.salary),
      password: inputs.password,
      confirmPassword: inputs.confirmPassword,
      job_title: inputs.role, // Added required field
    },
    {
      headers: {
        Authorization: `Bearer ${user.token}`, // Add Bearer token to headers
      },
    });
  };

  return (
    <div className="adduser-container">
      <ToastContainer /> {/* Toast container for notifications */}

      {/* <Nav /> */}
      <form onSubmit={handleSubmit} className="adduser-form">
        <h2 class="adduser-header">Add User</h2>

        <div className="mb-3">
          <label className="form-label">Username*</label>
          <input
            type="text"
            name="username"
            className="form-control"
            onChange={handleChange}
            value={inputs.username}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">First Name*</label>
          <input
            type="text"
            name="firstName"
            className="form-control"
            onChange={handleChange}
            value={inputs.firstName}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name*</label>
          <input
            type="text"
            name="lastName"
            className="form-control"
            onChange={handleChange}
            value={inputs.lastName}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email*</label>
          <input
            type="email"
            name="email"
            className="form-control"
            onChange={handleChange}
            value={inputs.email}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Salary*</label>
          <input
            type="text"
            name="salary"
            className="form-control"
            onChange={handleChange}
            value={inputs.salary}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            onChange={handleChange}
            value={inputs.phone}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <input
            type="text"
            name="role"
            className="form-control"
            onChange={handleChange}
            value={inputs.role}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password*</label>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={handleChange}
            value={inputs.password}
            required
          />
        </div>


        <div className="mb-3">
          <label className="form-label">Confirm Password*</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            onChange={handleChange}
            value={inputs.confirmPassword}
            required
          />
        </div>

        <button type="submit" className="btn btn-dark-green w-100">
          Register
        </button>
      </form>
    </div>
  );
}

export default AddUser;
