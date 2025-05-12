import React, { useState } from "react";
import Nav from "../Nav/NavSanooda";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBox, FaPlus, FaSave } from 'react-icons/fa';

function AddProduct() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    Product_name: "",
    quantity: "",
    price: "",
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
      navigate("/productdetails");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const sendRequest = async () => {
    return axios
      .post("http://localhost:8070/product/add", {
        Product_name: inputs.Product_name.trim(),
        quantity: parseInt(inputs.quantity) || 0,
        price: parseFloat(inputs.price) || 0,
      })
      .then((res) => res.data);
  };

  return (
    <div className="page-wrapper">
      <Nav />
      
      <div className="add-product-page">
        <div className="add-product-container">
          <div className="add-product-header">
            <h1><FaPlus className="header-icon" /> Add New Product</h1>
            <p>Enter the details of the product you want to add to inventory</p>
          </div>

          <form className="add-product-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <FaBox className="form-icon" /> Product Name
              </label>
              <input
                type="text"
                name="Product_name"
                onChange={handleChange}
                value={inputs.Product_name}
                className="form-input"
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaBox className="form-icon" /> Quantity
              </label>
              <input
                type="number"
                name="quantity"
                onChange={handleChange}
                value={inputs.quantity}
                className="form-input"
                placeholder="Enter quantity"
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaBox className="form-icon" /> Price
              </label>
              <input
                type="number"
                name="price"
                onChange={handleChange}
                value={inputs.price}
                className="form-input"
                placeholder="Enter price"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={() => navigate('/productdetails')}>
                Cancel
              </button>
              <button type="submit" className="submit-button">
                <FaSave className="button-icon" /> Save Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
