// import React, { useState, useEffect } from "react";
// import Nav from "../Nav/Nav";
// import axios from "axios";
// import Products from "./Products"; // ✅ Ensure correct import

// const URL = "http://localhost:8070/products";

// const fetchHandler = async () => {
//   try {
//     const res = await axios.get(URL);
//     return res.data; 
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return { product: [] }; 
//   }
// };

// function ProductDetails() {
//   const [products, setProducts] = useState([]); 
//   const [loading, setLoading] = useState(true); 

//   useEffect(() => {
//     fetchHandler().then((data) => {
//       setProducts(data.product || []); 
//       setLoading(false); 
//     });
//   }, []);

//   return (
//     <div>
//       <Nav />
//       <h1>Product Details Display Page</h1>
//       <div>
//         {loading ? (
//           <h3>Loading products...</h3> 
//         ) : products.length > 0 ? (
//           products.map((product, i) => (
//             <Products key={i} product={product} />
//           ))
//         ) : (
//           <p>No products available.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProductDetails;
