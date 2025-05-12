import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../InventoryHeader/InventoryHeader";
import { FaBox, FaExclamationTriangle, FaClock, FaTimes, FaPlus, FaTruck, FaChartBar } from 'react-icons/fa';
import AddProductToInventory from "../InventoryAddProductToInventory/AddProductToInventory";
import SupplierRequestForm from "./SupplierRequestForm";
import './InventoryDashboard.css';

export default function InventoryDashboard() {
  const navigate = useNavigate();
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
  });
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://localhost:8070/inventory");
      const data = await response.json();
      
      // Calculate stats
      const inventory = data.inventory || [];
      const lowStockItems = inventory.filter(item => item.current_stock < item.min_quan).length;
      const outOfStockItems = inventory.filter(item => item.current_stock === 0).length;

      setStats({
        totalProducts: inventory.length,
        lowStockItems,
        outOfStockItems,
      });

      // Simulate activity log (replace with actual API call)
      setActivityLog([
        {
          id: 1,
          action: "Product Added",
          details: "New product 'Organic Apples' added to inventory",
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          action: "Stock Updated",
          details: "Updated stock for 'Fresh Milk'",
          timestamp: new Date().toISOString(),
        },
      ]);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setShowAddProductModal(true);
  };

  const handleCloseModal = () => {
    setShowAddProductModal(false);
  };

  const handleRequestProduct = () => {
    setShowRequestModal(true);
  };

  const handleCloseRequestModal = () => {
    setShowRequestModal(false);
  };

  const handleGenerateReport = () => {
    navigate("/inventory/reports");
  };

  if (loading) {
    return (
      <div className="inv-page-wrapper">
        <div className="inv-dashboard-page">
          <div className="inv-dashboard-container">
            <div className="inv-loading-state">
              <div className="inv-loading-spinner"></div>
              <p>Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inv-page-wrapper">
        <div className="inv-dashboard-page">
          <div className="inv-dashboard-container">
            <div className="inv-error-message">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inv-page-wrapper">
      <Nav />
      <div className="inv-dashboard-page">
        <div className="inv-dashboard-container">
          <div className="inv-section-header">
            <div className="inv-header-content">
              <h1><FaBox className="inv-header-icon" /> Inventory Dashboard</h1>
              <p>Monitor your inventory status and activities</p>
            </div>
          </div>

          <div className="inv-stats-grid">
            <div className="inv-stat-card">
              <div className="inv-stat-icon inv-total">
                <FaBox />
              </div>
              <div className="inv-stat-content">
                <h3>Total Products</h3>
                <p className="inv-stat-number">{stats.totalProducts}</p>
              </div>
            </div>

            <div className="inv-stat-card">
              <div className="inv-stat-icon inv-warning">
                <FaExclamationTriangle />
              </div>
              <div className="inv-stat-content">
                <h3>Low Stock Items</h3>
                <p className="inv-stat-number">{stats.lowStockItems}</p>
              </div>
            </div>

            <div className="inv-stat-card">
              <div className="inv-stat-icon inv-danger">
                <FaExclamationTriangle />
              </div>
              <div className="inv-stat-content">
                <h3>Out of Stock</h3>
                <p className="inv-stat-number">{stats.outOfStockItems}</p>
              </div>
            </div>
          </div>

          <div className="inv-quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="inv-quick-actions-grid">
              <button className="inv-action-btn inv-add" onClick={handleAddProduct}>
                <FaPlus /> Add Product
              </button>
              <button className="inv-action-btn inv-receive" onClick={handleRequestProduct}>
                <FaTruck /> Request Product
              </button>
              <button className="inv-action-btn inv-reports" onClick={handleGenerateReport}>
                <FaChartBar /> Generate Report
              </button>
            </div>
          </div>

          <div className="inv-activity-log-section">
            <h2>Recent Activity</h2>
            <div className="inv-activity-log-card">
              <div className="inv-activity-log-table">
                <table>
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Details</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLog.map((log) => (
                      <tr key={log.id}>
                        <td className="inv-action-cell">{log.action}</td>
                        <td>{log.details}</td>
                        <td className="inv-timestamp-cell">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="inv-stock-status-section">
            <div className="inv-stock-status-card">
              <div className="inv-status-content">
                <h3>In Stock Items</h3>
                <p className="inv-status-number inv-success">
                  {stats.totalProducts - stats.outOfStockItems}
                </p>
              </div>
            </div>
            <div className="inv-stock-status-card">
              <div className="inv-status-content">
                <h3>Out of Stock Items</h3>
                <p className="inv-status-number inv-danger">
                  {stats.outOfStockItems}
                </p>
              </div>
            </div>
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

      {/* Supplier Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Request Product from Supplier</h2>
              <button className="close-button" onClick={handleCloseRequestModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <SupplierRequestForm onClose={handleCloseRequestModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
