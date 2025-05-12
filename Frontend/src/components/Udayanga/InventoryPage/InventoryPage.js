import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Nav from "../InventoryHeader/InventoryHeader";
import { FaPlus, FaSearch, FaBox, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import AddProductToInventory from "../InventoryAddProductToInventory/AddProductToInventory";

export default function InventoryPage() {
  const navigate = useNavigate();
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const [inputs, setInputs] = useState({
    cat_id: "",
  });
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const fetchInventory = async (catId = "") => {
    try {
      const url = catId
        ? `http://localhost:8070/inventory/category/${catId}`
        : "http://localhost:8070/inventory";
      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched Inventory:", data);
      setInventory(data.inventory || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when category changes
    fetchInventory(value); // Fetch inventory based on selected category
  };

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:8070/category")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError(err.message);
      });
  }, []);

  // Fetch initial inventory
  useEffect(() => {
    fetchInventory(); // Fetch all inventory on component mount
  }, []);

  const totalPages = Math.ceil(inventory.length / itemsPerPage);
  const paginatedInventory = inventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleAddProduct = () => {
    setShowAddProductModal(true);
  };

  const handleCloseModal = () => {
    setShowAddProductModal(false);
  };

  return (
    <div className="inv-page-wrapper">
      <Nav />
      <div className="inv-inventory-page">
        <div className="inv-inventory-container">
          <div className="inv-section-header">
            <div className="inv-header-content">
              <h1><FaBox className="inv-header-icon" /> Inventory List</h1>
              <p>Manage and monitor your inventory items</p>
            </div>
          </div>

          <div className="inv-action-bar">
            <div className="inv-action-grid">
              <button
                className="inv-action-btn inv-add"
                onClick={handleAddProduct}
              >
                <FaPlus /> Add Product to Inventory
              </button>

              <div className="inv-search-container">
                <div className="inv-search-wrapper">
                  <input
                    className="inv-search-input"
                    type="search"
                    placeholder="Search products..."
                    aria-label="Search"
                  />
                  <button className="inv-search-btn" type="submit">
                    <FaSearch /> Search
                  </button>
                </div>
              </div>
            </div>

            <div className="inv-category-selector">
              <label htmlFor="cat_id" className="inv-form-label">
                Category
              </label>
              <select
                className="inv-form-select"
                id="cat_id"
                onChange={handleChange}
                name="cat_id"
                value={inputs.cat_id}
              >
                <option value="">All Categories</option>
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
          </div>

          <div className="inv-inventory-section">
            <h2 className="inv-section-title">Products in Inventory</h2>
            <div className="inv-inventory-card">
              {loading ? (
                <div className="inv-loading-state">
                  <div className="inv-loading-spinner"></div>
                  <p>Loading inventory...</p>
                </div>
              ) : error ? (
                <div className="inv-error-message">{error}</div>
              ) : inventory.length === 0 ? (
                <div className="inv-no-data">No inventory found</div>
              ) : (
                <div className="inv-table-container">
                  <table className="inv-inventory-table">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Current Stock</th>
                        <th>Min Quantity</th>
                        <th>Max Quantity</th>
                        <th>Category Name</th>
                        <th>Last Update</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedInventory.map((inven) => {
                        const isLowStock = inven.current_stock < inven.min_quan;
                        return (
                          <tr key={inven._id} className={isLowStock ? "inv-low-stock" : ""}>
                            <td>
                              <Link
                                to={`/inventory/${inven._id}`}
                                className="inv-product-link"
                              >
                                {inven.product_name || "Unknown"}
                              </Link>
                            </td>
                            <td className="inv-stock-cell">
                              {inven.current_stock || 0}
                            </td>
                            <td>{inven.min_quan || 0}</td>
                            <td>{inven.max_quan || 0}</td>
                            <td>{inven.cat_name || "Unknown"}</td>
                            <td className="inv-timestamp-cell">
                              {inven.last_updated
                                ? new Date(inven.last_updated).toLocaleString()
                                : "N/A"}
                            </td>
                            <td>
                              <span className={`inv-status-badge ${isLowStock ? 'inv-status-warning' : 'inv-status-normal'}`}>
                                {isLowStock ? (
                                  <>
                                    <FaExclamationTriangle /> Low Stock
                                  </>
                                ) : (
                                  "Normal Stock"
                                )}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="inv-pagination">
            <button 
              className="inv-pagination-btn"
              onClick={handlePrevious} 
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="inv-page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="inv-pagination-btn"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Product to Inventory</h2>
              <button className="close-button" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <AddProductToInventory onClose={handleCloseModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
