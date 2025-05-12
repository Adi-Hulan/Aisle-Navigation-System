import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './InventoryDashboard.css';

const SupplierRequestForm = ({ onClose }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [formData, setFormData] = useState({
        supplierId: '',
        item: '',
        qty: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8070/supplier', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Oops, we haven't got JSON!");
            }

            const data = await response.json();
            console.log('Suppliers data:', data); // Debug log
            setSuppliers(data.supplier || []);
        } catch (err) {
            console.error('Error details:', err);
            setError(`Failed to fetch suppliers: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8070/supplier/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit request');
            }

            const data = await response.json();
            alert('Request submitted successfully!');
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="supplier-request-form">
            <h2>Request Product from Supplier</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="supplierId">Select Supplier:</label>
                    <select
                        id="supplierId"
                        name="supplierId"
                        value={formData.supplierId}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="">Select a supplier</option>
                        {suppliers.map(supplier => (
                            <option key={supplier._id} value={supplier._id}>
                                {supplier.supplier_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="item">Item Name:</label>
                    <input
                        type="text"
                        id="item"
                        name="item"
                        value={formData.item}
                        onChange={handleChange}
                        required
                        placeholder="Enter item name"
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="qty">Quantity:</label>
                    <input
                        type="text"
                        id="qty"
                        name="qty"
                        value={formData.qty}
                        onChange={handleChange}
                        required
                        placeholder="Enter quantity"
                        disabled={loading}
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                    <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SupplierRequestForm; 