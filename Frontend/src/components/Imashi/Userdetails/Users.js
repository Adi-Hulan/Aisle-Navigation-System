import React, { useEffect, useState } from "react";
import axios from "axios";
import User from "../User/User";
import Nav from "../Nav/NavImashi";
import { FaUserPlus, FaTimes, FaUsers, FaSpinner, FaUserCircle, FaEnvelope, FaPhone, FaBriefcase, FaMoneyBillWave, FaMapMarkerAlt, FaMap } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuthContext } from "../../../hooks/useAuthContext";
import { toast, ToastContainer } from "react-toastify";
import '../Imashi.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Users() {
  const { user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    managers: 0
  });
  
  // Separate form data states for add and edit
  const [addFormData, setAddFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    salary: "",
    password: "",
    confirmPassword: "",
    role: ""
  });

  const [editFormData, setEditFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    salary: "",
    role: ""
  });

  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8070/users");
        const usersData = response.data.users || [];
        setUsers(usersData);
        
        // Calculate stats
        setStats({
          total: usersData.length,
          active: usersData.filter(u => u.status === 'active').length,
          managers: usersData.filter(u => u.job_title?.toLowerCase().includes('manager')).length
        });
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setAddFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddClick = () => {
    // Reset add form data
    setAddFormData({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      salary: "",
      password: "",
      confirmPassword: "",
      role: ""
    });
    setShowAddModal(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditFormData({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      salary: user.salary,
      role: user.job_title
    });
    setShowEditModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (addFormData.password !== addFormData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate required fields
    const requiredFields = ['username', 'firstName', 'lastName', 'email', 'salary', 'role', 'password'];
    const missingFields = requiredFields.filter(field => !addFormData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8070/users/add",
        {
          username: addFormData.username,
          firstName: addFormData.firstName,
          lastName: addFormData.lastName,
          email: addFormData.email,
          phone: addFormData.phone || "",
          salary: Number(addFormData.salary),
          password: addFormData.password,
          confirmPassword: addFormData.confirmPassword,
          job_title: addFormData.role,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.data) {
        setShowAddModal(false);
        toast.success("User added successfully!", {
          position: "top-right",
          autoClose: 2000,
          onClose: () => {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || "Error adding user. Please check all fields and try again.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8070/users/update/${selectedUser._id}`,
        {
          username: editFormData.username,
          firstName: editFormData.firstName,
          lastName: editFormData.lastName,
          email: editFormData.email,
          phone: editFormData.phone || "",
          salary: Number(editFormData.salary),
          job_title: editFormData.role,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.data) {
        setShowEditModal(false);
        toast.success("User updated successfully!", {
          position: "top-right",
          autoClose: 2000,
          onClose: () => {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating user");
    }
  };

  const handleViewLocation = (user) => {
    if (user.location) {
      setSelectedLocation({
        lat: user.location.latitude,
        lng: user.location.longitude,
        name: `${user.firstName} ${user.lastName}`,
        lastUpdated: user.location.lastUpdated
      });
      setShowMapModal(true);
    } else {
      toast.info("No location data available for this user");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "" || user.job_title === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="imashi-page-wrapper">
        <Nav />
        <div className="imashi-container">
          <div className="imashi-loading">
            <FaSpinner className="imashi-spinner" />
            <p>Loading employees...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="imashi-page-wrapper">
        <Nav />
        <div className="imashi-container">
          <div className="imashi-message imashi-message-error">
            <FaTimes />
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="imashi-page-wrapper">
      <Nav />
      <div className="imashi-container">
        <div className="imashi-dashboard-header">
          <div className="imashi-header-content">
            <h1><FaUsers className="imashi-header-icon" /> Employee Dashboard</h1>
            <p>Manage and monitor your team members</p>
          </div>
          <button 
            className="imashi-btn imashi-btn-primary"
            onClick={handleAddClick}
          >
            <FaUserPlus /> Add Employee
          </button>
        </div>

        <div className="imashi-stats-grid">
          <div className="imashi-stat-card">
            <div className="imashi-stat-icon">
              <FaUsers />
            </div>
            <div className="imashi-stat-content">
              <h3>Total Employees</h3>
              <p>{stats.total}</p>
            </div>
          </div>
          <div className="imashi-stat-card">
            <div className="imashi-stat-icon">
              <FaUserCircle />
            </div>
            <div className="imashi-stat-content">
              <h3>Active Employees</h3>
              <p>{stats.active}</p>
            </div>
          </div>
          <div className="imashi-stat-card">
            <div className="imashi-stat-icon">
              <FaBriefcase />
            </div>
            <div className="imashi-stat-content">
              <h3>Managers</h3>
              <p>{stats.managers}</p>
            </div>
          </div>
        </div>

        <div className="imashi-section">
          <div className="imashi-section-header">
            <h2>Employee Directory</h2>
            <div className="imashi-search-filter-container">
              <div className="imashi-search-box">
                <input 
                  type="text" 
                  placeholder="Search employees..." 
                  className="imashi-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="imashi-filter-box">
                <select
                  className="imashi-filter-select"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="inventoryManager">Inventory Manager</option>
                  <option value="stockManager">Stock Manager</option>
                  <option value="customer">Customer</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>
            </div>
          </div>

          <div className="imashi-users-grid">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user._id} className="imashi-user-card">
                  <div className="imashi-user-card-header">
                    <div className="imashi-user-avatar">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div className="imashi-user-info">
                      <h3>{user.firstName} {user.lastName}</h3>
                      <span className="imashi-user-role">{user.job_title}</span>
                    </div>
                  </div>
                  <div className="imashi-user-details">
                    <div className="imashi-user-detail">
                      <FaEnvelope />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="imashi-user-detail">
                        <FaPhone />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="imashi-user-detail">
                      <FaMoneyBillWave />
                      <span>LKR {user.salary?.toLocaleString()}</span>
                    </div>
                    {user.location && (
                      <div className="imashi-user-detail">
                        <FaMapMarkerAlt />
                        <span>
                          {user.location.latitude?.toFixed(4)}, {user.location.longitude?.toFixed(4)}
                          {user.location.lastUpdated && (
                            <small style={{ display: 'block', fontSize: '0.8em', color: '#666' }}>
                              Last updated: {new Date(user.location.lastUpdated).toLocaleString()}
                            </small>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="imashi-user-actions">
                    {user.location && (
                      <button 
                        className="imashi-btn imashi-btn-secondary"
                        onClick={() => handleViewLocation(user)}
                      >
                        <FaMap /> View on Map
                      </button>
                    )}
                    <button 
                      className="imashi-btn imashi-btn-primary"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="imashi-no-users">
                <FaUsers />
                <p>No employees found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="imashi-modal-overlay">
          <div className="imashi-modal-content">
            <button 
              className="imashi-modal-close"
              onClick={() => setShowAddModal(false)}
            >
              <FaTimes />
            </button>
            <form onSubmit={handleAddSubmit} className="imashi-form">
              <h3 className="imashi-form-title">Add New Employee</h3>
              
              <div className="imashi-form-group">
                <label className="imashi-form-label">Username*</label>
                <input
                  type="text"
                  name="username"
                  value={addFormData.username}
                  onChange={(e) => handleInputChange(e, false)}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={addFormData.firstName}
                  onChange={(e) => handleInputChange(e, false)}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  value={addFormData.lastName}
                  onChange={(e) => handleInputChange(e, false)}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={addFormData.email}
                  onChange={(e) => handleInputChange(e, false)}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Salary*</label>
                <input
                  type="number"
                  name="salary"
                  value={addFormData.salary}
                  onChange={(e) => handleInputChange(e, false)}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={addFormData.phone}
                  onChange={(e) => handleInputChange(e, false)}
                  className="imashi-form-input"
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Role*</label>
                <select
                  name="role"
                  value={addFormData.role}
                  onChange={(e) => handleInputChange(e, false)}
                  className="imashi-form-input"
                  required
                >
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="inventoryManager">Inventory Manager</option>
                  <option value="stockManager">Stock Manager</option>
                  <option value="customer">Customer</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Password*</label>
                <input
                  type="password"
                  name="password"
                  value={addFormData.password}
                  onChange={(e) => handleInputChange(e, false)}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Confirm Password*</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={addFormData.confirmPassword}
                  onChange={(e) => handleInputChange(e, false)}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-actions">
                <button
                  type="button"
                  className="imashi-btn imashi-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="imashi-btn imashi-btn-primary">
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="imashi-modal-overlay">
          <div className="imashi-modal-content">
            <button 
              className="imashi-modal-close"
              onClick={() => setShowEditModal(false)}
            >
              <FaTimes />
            </button>
            <form onSubmit={handleEditSubmit} className="imashi-form">
              <h3 className="imashi-form-title">Edit Employee</h3>
              
              <div className="imashi-form-group">
                <label className="imashi-form-label">Username*</label>
                <input
                  type="text"
                  name="username"
                  value={editFormData.username}
                  onChange={(e) => handleInputChange(e, true)}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={editFormData.firstName}
                  onChange={(e) => handleInputChange(e, true)}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  value={editFormData.lastName}
                  onChange={(e) => handleInputChange(e, true)}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={(e) => handleInputChange(e, true)}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Salary*</label>
                <input
                  type="number"
                  name="salary"
                  value={editFormData.salary}
                  onChange={(e) => handleInputChange(e, true)}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone}
                  onChange={(e) => handleInputChange(e, true)}
                  className="imashi-form-input"
                />
              </div>

              <div className="imashi-form-group">
                <label className="imashi-form-label">Role*</label>
                <input
                  type="text"
                  name="role"
                  value={editFormData.role}
                  onChange={(e) => handleInputChange(e, true)}
                  className="imashi-form-input"
                  required
                />
              </div>

              <div className="imashi-form-actions">
                <button
                  type="button"
                  className="imashi-btn imashi-btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="imashi-btn imashi-btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMapModal && selectedLocation && (
        <div className="imashi-modal-overlay">
          <div className="imashi-modal-content" style={{ width: '80%', maxWidth: '800px', height: '80vh' }}>
            <button 
              className="imashi-modal-close"
              onClick={() => setShowMapModal(false)}
            >
              <FaTimes />
            </button>
            <h3 className="imashi-form-title">Location Map</h3>
            <div style={{ height: '100%', width: '100%', position: 'relative' }}>
              <MapContainer 
                center={[selectedLocation.lat, selectedLocation.lng]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                  <Popup>
                    <div>
                      <strong>{selectedLocation.name}</strong>
                      <br />
                      Last updated: {new Date(selectedLocation.lastUpdated).toLocaleString()}
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Users;
