import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Nav from "../Imashi/Nav/NavImashi";

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8070/product/withDet"
        );
        console.log("Fetched Products:", response.data);
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

  return (
    <div className="mb-4">
      {/* Header */}
      <Nav />

      {/* Admin Header */}
      <div className="d-flex justify-content-between align-items-center my-4 px-4">
        <h2 className="text-black m-0">Product Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/inventory/add")}
        >
          Add Product
        </button>
      </div>

      {/* Product Table */}
      <div className="card shadow mx-4">
        <div className="card-body">
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : products.length === 0 ? (
            <p>No products found in inventory.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Barcode</th>
                    <th>Supplier</th>
                    <th>Category</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id || Math.random()}>
                      <td>
                        <Link
                          to={`/inventory/product/${product._id}`}
                          style={{ textDecoration: "none", color: "#007bff" }}
                        >
                          {product.pr_name || "Unknown"}
                        </Link>
                      </td>
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
    </div>
  );
};
