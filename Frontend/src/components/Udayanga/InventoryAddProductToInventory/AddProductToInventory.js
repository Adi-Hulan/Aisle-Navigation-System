import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddProductToInventory({ onClose }) {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        product_id: "",
        current_stock: "",
        min_quan: "",
        max_quan: "",
        cat_id: ""
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((prevState) => ({
            ...prevState,
            [name]: value
        }));

        // If the selected product changes, update cat_id automatically
        if (name === "product_id") {
            const selectedProduct = products.find(p => p._id === value);
            setInputs(prev => ({
                ...prev,
                cat_id: selectedProduct?.cat_id || ""
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ['product_id', 'current_stock', 'cat_id'];
        const missingFields = requiredFields.filter(field => !inputs[field]);

        if (missingFields.length > 0) {
            setError(`Please fill all required fields: ${missingFields.join(', ')}`);
            return;
        }

        if (isNaN(Number(inputs.current_stock))) {
            setError("Current stock must be a number");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await sendRequest();
            if (onClose) {
                onClose();
            } else {
                navigate("/inventory/inventorypage");
            }
        } catch (err) {
            console.error("Error adding product to inventory:", err);
            setError(err.response?.data?.message || "Failed to add product to inventory.");
        } finally {
            setLoading(false);
        }
    };

    const sendRequest = async () => {
        const payload = {
            product_id: inputs.product_id,
            current_stock: Number(inputs.current_stock),
            min_quan: inputs.min_quan ? Number(inputs.min_quan) : undefined,
            max_quan: inputs.max_quan ? Number(inputs.max_quan) : undefined,
            cat_id: inputs.cat_id
        };

        console.log("Request payload:", JSON.stringify(payload, null, 2));

        const response = await axios.post("http://localhost:8070/inventory/add", payload, {
            headers: { "Content-Type": "application/json" }
        });

        return response.data;
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:8070/product");
                console.log("Fetched Products:", response.data);
                setProducts(response.data.products || []);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products");
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="add-product-form">
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="product_id" className="form-label">Product *</label>
                    <select 
                        className="form-input" 
                        id="product_id" 
                        name="product_id" 
                        value={inputs.product_id} 
                        onChange={handleChange} 
                        required
                        disabled={loading || products.length === 0}
                    >
                        <option value="">Select a product</option>
                        {products.map((product) => (
                            <option key={product._id} value={product._id}>
                                {product.pr_name || "Unnamed Product"} (ID: {product._id})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="current_stock" className="form-label">Current Stock *</label>
                    <input 
                        type="number" 
                        className="form-input" 
                        id="current_stock" 
                        name="current_stock" 
                        value={inputs.current_stock} 
                        onChange={handleChange} 
                        placeholder="Enter Current Stock" 
                        required 
                        min="0"
                        disabled={loading}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="min_quan" className="form-label">Minimum Quantity</label>
                        <input 
                            type="number" 
                            className="form-input" 
                            id="min_quan" 
                            name="min_quan" 
                            value={inputs.min_quan} 
                            onChange={handleChange} 
                            placeholder="Enter Minimum Quantity" 
                            min="0"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="max_quan" className="form-label">Maximum Quantity</label>
                        <input 
                            type="number" 
                            className="form-input" 
                            id="max_quan" 
                            name="max_quan" 
                            value={inputs.max_quan} 
                            onChange={handleChange} 
                            placeholder="Enter Maximum Quantity" 
                            min="0"
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Hidden Input for cat_id */}
                <input type="hidden" name="cat_id" value={inputs.cat_id} />

                <div className="form-actions">
                    <button 
                        type="button" 
                        className="cancel-button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="submit-button" 
                        disabled={loading || products.length === 0}
                    >
                        {loading ? "Submitting..." : "Add Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
