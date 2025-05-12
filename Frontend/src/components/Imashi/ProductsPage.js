import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "./Nav/NavImashi";
import { 
  FaPlus, 
  FaBox, 
  FaSpinner, 
  FaSearch, 
  FaTable, 
  FaBoxes, 
  FaTag, 
  FaUser, 
  FaExclamationTriangle,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaTimes,
  FaBarcode,
  FaDollarSign,
  FaCalendarAlt,
  FaInfoCircle
} from "react-icons/fa";
import './Imashi.css';

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8070/product/withDet"
        );
        setProducts(response.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.pr_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: products.length,
    lowStock: products.filter(p => p.quantity < 10).length,
    categories: new Set(products.map(p => p.cat_id?.cat_name)).size,
    suppliers: new Set(products.map(p => p.supplier_id?.supplier_name)).size
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === bValue) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;

    const comparison = aValue.toString().localeCompare(bValue.toString());
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
  };

  return (
    <div className="imashi-page-wrapper">
      <Nav />
      <div className="imashi-container">
        <div className="imashi-dashboard-header">
          <div className="imashi-header-content">
            <h1><FaBox className="imashi-header-icon" /> Product Management</h1>
            <p>Manage and monitor your product inventory</p>
          </div>
          <button
            className="imashi-btn imashi-btn-primary"
            onClick={() => navigate("/inventory/add")}
          >
            <FaPlus /> Add Product
          </button>
        </div>

        <div className="imashi-stats-grid">
          <div className="imashi-stat-card">
            <div className="imashi-stat-icon">
              <FaBoxes />
            </div>
            <div className="imashi-stat-content">
              <h3>Total Products</h3>
              <p>{stats.total}</p>
            </div>
          </div>
          <div className="imashi-stat-card">
            <div className="imashi-stat-icon">
              <FaExclamationTriangle />
            </div>
            <div className="imashi-stat-content">
              <h3>Low Stock Items</h3>
              <p>{stats.lowStock}</p>
            </div>
          </div>
          <div className="imashi-stat-card">
            <div className="imashi-stat-icon">
              <FaTag />
            </div>
            <div className="imashi-stat-content">
              <h3>Categories</h3>
              <p>{stats.categories}</p>
            </div>
          </div>
          <div className="imashi-stat-card">
            <div className="imashi-stat-icon">
              <FaUser />
            </div>
            <div className="imashi-stat-content">
              <h3>Suppliers</h3>
              <p>{stats.suppliers}</p>
            </div>
          </div>
        </div>

        <div className="imashi-section">
          <div className="imashi-section-header">
            <h2><FaTable /> Product List</h2>
            <div className="imashi-search-box">
              <FaSearch className="imashi-search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                className="imashi-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="imashi-loading">
              <FaSpinner className="imashi-spinner" />
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="imashi-message imashi-message-error">
              <FaBox />
              <p>{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="imashi-message imashi-message-warning">
              <FaBox />
              <p>No products found in inventory.</p>
            </div>
          ) : (
            <div className="imashi-table-responsive">
              <table className="imashi-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('pr_name')} className="imashi-sortable">
                      Product Name {getSortIcon('pr_name')}
                    </th>
                    <th onClick={() => handleSort('description')} className="imashi-sortable">
                      Description {getSortIcon('description')}
                    </th>
                    <th onClick={() => handleSort('barcode')} className="imashi-sortable">
                      Barcode {getSortIcon('barcode')}
                    </th>
                    <th onClick={() => handleSort('supplier_id.supplier_name')} className="imashi-sortable">
                      Supplier {getSortIcon('supplier_id.supplier_name')}
                    </th>
                    <th onClick={() => handleSort('cat_id.cat_name')} className="imashi-sortable">
                      Category {getSortIcon('cat_id.cat_name')}
                    </th>
                    <th onClick={() => handleSort('added_on')} className="imashi-sortable">
                      Last Updated {getSortIcon('added_on')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((product) => (
                    <tr 
                      key={product._id || Math.random()}
                      onClick={() => handleRowClick(product)}
                      className="imashi-clickable-row"
                    >
                      <td>{product.pr_name || "Unknown"}</td>
                      <td>{product.description || "N/A"}</td>
                      <td>{product.barcode || "N/A"}</td>
                      <td>{product.supplier_id?.supplier_name || "N/A"}</td>
                      <td>{product.cat_id?.cat_name || "Unknown"}</td>
                      <td>
                        {product.added_on
                          ? new Date(product.added_on).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedProduct && (
        <div className="imashi-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="imashi-modal-content" onClick={e => e.stopPropagation()}>
            <button className="imashi-modal-close" onClick={() => setShowModal(false)}>
              <FaTimes />
            </button>
            <div className="imashi-modal-header">
              <h2><FaBox /> Product Details</h2>
            </div>
            <div className="imashi-modal-body">
              <div className="imashi-product-details-grid">
                <div className="imashi-detail-item">
                  <div className="imashi-detail-label">
                    <FaBox /> Product Name
                  </div>
                  <div className="imashi-detail-value">{selectedProduct.pr_name}</div>
                </div>

                <div className="imashi-detail-item">
                  <div className="imashi-detail-label">
                    <FaInfoCircle /> Description
                  </div>
                  <div className="imashi-detail-value">
                    {selectedProduct.description || "No description available"}
                  </div>
                </div>

                <div className="imashi-detail-item">
                  <div className="imashi-detail-label">
                    <FaBarcode /> Barcode
                  </div>
                  <div className="imashi-detail-value">{selectedProduct.barcode || "N/A"}</div>
                </div>

                <div className="imashi-detail-item">
                  <div className="imashi-detail-label">
                    <FaDollarSign /> Unit Price
                  </div>
                  <div className="imashi-detail-value">
                    ${selectedProduct.unit_price?.toFixed(2) || "N/A"}
                  </div>
                </div>

                <div className="imashi-detail-item">
                  <div className="imashi-detail-label">
                    <FaTag /> Category
                  </div>
                  <div className="imashi-detail-value">
                    {selectedProduct.cat_id?.cat_name || "N/A"}
                  </div>
                </div>

                <div className="imashi-detail-item">
                  <div className="imashi-detail-label">
                    <FaUser /> Supplier
                  </div>
                  <div className="imashi-detail-value">
                    {selectedProduct.supplier_id?.supplier_name || "N/A"}
                  </div>
                </div>

                <div className="imashi-detail-item">
                  <div className="imashi-detail-label">
                    <FaCalendarAlt /> Added On
                  </div>
                  <div className="imashi-detail-value">
                    {formatDate(selectedProduct.added_on)}
                  </div>
                </div>

                <div className="imashi-detail-item">
                  <div className="imashi-detail-label">
                    <FaCalendarAlt /> Expiration Date
                  </div>
                  <div className="imashi-detail-value">
                    {formatDate(selectedProduct.exp_date)}
                  </div>
                </div>
              </div>
            </div>
            <div className="imashi-modal-footer">
              <button 
                className="imashi-btn imashi-btn-primary"
                onClick={() => navigate(`/inventory/product/${selectedProduct._id}`)}
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage; 