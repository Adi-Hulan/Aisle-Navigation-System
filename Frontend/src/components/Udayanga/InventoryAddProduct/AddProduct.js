import React, { useEffect, useState } from "react";
import { Route, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddProduct() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    pr_name: "",
    description: "",
    cat_id: "",
    barcode: "",
    shelf: "",
    aisle: "",
    row: "",
    unit_price: "",
    supplier_id: "",
    exp_date: "",
    promotions: "",
    image_url: "", // Add image_url to initial state
  });

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Comprehensive validation
    const requiredFields = [
      "pr_name",
      "unit_price",
      "barcode",
      "shelf",
      "aisle",
      "row",
      "exp_date",
      "cat_id",
    ];
    const missingFields = requiredFields.filter((field) => !inputs[field]);

    if (missingFields.length > 0) {
      alert(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    setLoading(true);
    try {
      await sendRequest();
      navigate("/inventory/productsPage"); // Redirect to Dashboard
    } catch (err) {
      console.error("Error submitting product:", err);
      setError(
        err.response?.data?.message ||
          "Failed to add product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async () => {
    try {
      const payload = {
        pr_name: String(inputs.pr_name),
        description: String(inputs.description || ""),
        cat_id: String(inputs.cat_id),
        barcode: String(inputs.barcode),
        shelf: String(inputs.shelf),
        aisle: String(inputs.aisle),
        row: String(inputs.row),
        unit_price: parseFloat(inputs.unit_price),
        supplier_id: String(inputs.supplier_id || ""),
        exp_date: String(inputs.exp_date),
        image_url: String(inputs.image_url || ""),
      };

      console.log("Request payload:", JSON.stringify(payload, null, 2));

      const response = await axios.post(
        "http://localhost:8070/product/add",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Response:", response.data); // Log the successful response
      return response.data;
    } catch (err) {
      // Log the full error response for debugging
      console.error("API Request Failed:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data, // This might show HTML if that's the issue
      });
      throw err;
    }
  };

  useEffect(() => {
    fetch("http://localhost:8070/category")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8070/supplier")
      .then((res) => res.json())
      .then((data) => setSuppliers(data.supplier || []))
      .catch((err) => console.error("Error fetching suppliers:", err));
  }, []);

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3 full-width">
          <label htmlFor="pr_name" className="form-label">
            Product Name *
          </label>
          <input
            type="text"
            className="form-control"
            id="pr_name"
            onChange={handleChange}
            name="pr_name"
            value={inputs.pr_name}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="mb-3 full-width">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            onChange={handleChange}
            name="description"
            value={inputs.description}
            placeholder="Enter Description"
          />
        </div>

        <div className="mb-3 full-width">
          <label htmlFor="image_url" className="form-label">
            Product Image URL
          </label>
          <input
            type="url"
            className="form-control"
            id="image_url"
            onChange={handleChange}
            name="image_url"
            value={inputs.image_url}
            placeholder="Enter image URL (http:// or https://)"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="barcode" className="form-label">
            Barcode *
          </label>
          <input
            type="text"
            className="form-control"
            id="barcode"
            onChange={handleChange}
            name="barcode"
            value={inputs.barcode}
            placeholder="Enter Barcode"
          />
        </div>

        <div className="row">
          <div className="col-md-4">
            <label htmlFor="shelf" className="form-label">
              Shelf *
            </label>
            <input
              type="text"
              className="form-control"
              id="shelf"
              onChange={handleChange}
              name="shelf"
              value={inputs.shelf}
              placeholder="Enter Shelf"
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="aisle" className="form-label">
              Aisle *
            </label>
            <input
              type="text"
              className="form-control"
              id="aisle"
              onChange={handleChange}
              name="aisle"
              value={inputs.aisle}
              placeholder="Enter Aisle"
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="row" className="form-label">
              Row *
            </label>
            <input
              type="text"
              className="form-control"
              id="row"
              onChange={handleChange}
              name="row"
              value={inputs.row}
              placeholder="Enter Row"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="unit_price" className="form-label">
              Unit Price *
            </label>
            <input
              type="number"
              className="form-control"
              id="unit_price"
              onChange={handleChange}
              name="unit_price"
              value={inputs.unit_price}
              placeholder="Enter Unit Price"
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="exp_date" className="form-label">
              Expiry Date *
            </label>
            <input
              type="date"
              className="form-control"
              id="exp_date"
              onChange={handleChange}
              name="exp_date"
              value={inputs.exp_date}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="cat_id" className="form-label">
              Category
            </label>
            <select
              className="form-select"
              id="cat_id"
              onChange={handleChange}
              name="cat_id"
              value={inputs.cat_id}
              required
            >
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option
                  key={category?._id || Math.random()}
                  value={category?._id || ""}
                >
                  {category?.cat_name || "Unknown Category"}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="supplier_id" className="form-label">
              Supplier
            </label>
            <select
              className="form-select"
              id="supplier_id"
              onChange={handleChange}
              name="supplier_id"
              value={inputs.supplier_id}
              required
            >
              <option value="">Select a Supplier</option>
              {suppliers.map((supplier) => (
                <option
                  key={supplier?._id || Math.random()}
                  value={supplier?._id || ""}
                >
                  {supplier?.supplier_name || "Unknown Supplier"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="submit-container">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
