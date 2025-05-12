import React from "react";
import "./index.css";
//import './App.css';
import AddProduct from "./components/Udayanga/InventoryAddProduct/AddProduct";
import Dashboard from "./components/Udayanga/InventoryDashboard/InventoryDashboard";
import InventoryHeader from "./components/Udayanga/InventoryHeader/InventoryHeader";
import {
  BrowserRouter as Router,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import InventoryPage from "./components/Udayanga/InventoryPage/InventoryPage";
import ProductDetails from "./components/Udayanga/ProductDetails";
import AddProductToInventory from "./components/Udayanga/InventoryAddProductToInventory/AddProductToInventory";

//kasun
import GuestHome from "./components/Kasun/Guest Home/GuestHome";
import Home from "./components/Kasun/Home/Home";
import AddFeedback from "./components/Kasun/AddFeedback/AddFeedback";
import Feedbacks from "./components/Kasun/Details/Feedbacks";
import Details from "./components/Kasun/Details/Feedbacks";
import ContactUs from "./components/Kasun/ContactUs/ContactUs";
import UpdateFeedback from "./components/Kasun/UpdateFeedback/UpdateFeedback";
import Products from "./components/Kasun/ProductDisplay/Products";
import Product from "./components/Kasun/Product/Product";
import SingleProduct from "./components/Kasun/SingleProduct/SingleProduct";

//asiri
import StockManagerDash from "./components/Asiri/StockManagerDash/StockManagerDash";
import StockRequest from "./components/Asiri/StockRequest/StockRequest";

//Imashi
import NavImashi from "./components/Imashi/Nav/NavImashi";
import SendLocation from "./components/Imashi/SendLocation";
import UserHome from "./components/Imashi/Home/Home";
import AddUser from "./components/Imashi/AddUser/AddUser";
import Users from "./components/Imashi/Userdetails/Users";
import UpdateUser from "./components/Imashi/UpdateUser/UpdateUser";
import Register from "./components/Imashi/Register/Register";
import Login from "./components/Imashi/Login/Login";

//Sanooda
import ProductHome from "./components/Sanooda/home/Home";
import SanoodaAddProduct from "./components/Sanooda/Add Product/AddProduct";
import SanoodaProductDetails from "./components/Sanooda/ProductDetails/ProductDetails";
import UpdateProduct from "./components/Sanooda/Update Product/UpdateProduct";
import { ProductsPage } from "./components/Imashi/ProductsPage";
import { InventoryProductDetails } from "./components/Udayanga/InventoryProductDetails/InventoryProductDetails";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" exact Component={GuestHome} />
          <Route path="/product/:id" element={<SingleProduct />} />

          <Route
            path="/inventory/inventorydashboard"
            exact
            Component={Dashboard}
          />
          <Route path="/inventoryheader" exact Component={InventoryHeader} />
          <Route
            path="/inventory/inventorypage"
            exact
            Component={InventoryPage}
          />
          <Route
            path="/inventory/addinventory"
            exact
            Component={AddProductToInventory}
          />
          <Route
            path="/inventory/productdetails"
            exact
            Component={ProductDetails}
          />
          <Route
            path="/inventory/:productId"
            exact
            Component={InventoryProductDetails}
          />

          <Route
            path="/inventory/productsPage"
            exact
            Component={ProductsPage}
          />
          <Route
            path="/inventory/product/:productId"
            exact
            Component={ProductDetails}
          />

          <Route path="/inventory/add" exact Component={AddProduct} />

          {/*Kasun*/}
          <Route path="/website/home" element={<Home />} />
          <Route path="/website/productdetails" element={<Products />} />
          <Route path="/website/addfeedback" element={<AddFeedback />} />
          <Route
            path="/website/feedbackdetails/:id"
            element={<UpdateFeedback />}
          />
          <Route path="/website/conus" element={<ContactUs />} />
          <Route path="/website" element={<GuestHome />} />
          <Route path="/website/feedbacks" element={<Feedbacks />} />
          {/* <Route path="/guesthome" element={<GuestHome />} />
          <Route path="/feedbackdetails" element={<Details />} />
          <Route path="/produc" element={<Product />} />  */}

          {/*Asiri*/}
          <Route path="/stock/" element={<StockManagerDash />} />
          <Route
            path="/stock/StockManagerDash"
            element={<StockManagerDash />}
          />
          <Route path="/stock/StockRequest" element={<StockRequest />} />

          {/*Imashi*/}
          <Route path="/User/register" element={<Register />} />
          <Route path="/User/login" element={<Login />} />
          <Route path="/User/navimashi" element={<NavImashi />} />
          <Route path="/User/userdetails" element={<Users />} />
          <Route path="/User/adduser" element={<AddUser />} />
          <Route path="/User/sendLocation" element={<SendLocation />} />
          <Route path="/User/" element={<UserHome />} />
          <Route path="/User/mainHome" element={<UserHome />} />
          <Route
            path="/User/userdetails/:employeeId"
            element={<UpdateUser />}
          />
          <Route path="/productsPage" element={<ProductsPage />} />

          {/*Sanooda*/}
          <Route path="/supplier/" element={<ProductHome />} />
          <Route path="/supplier/supplierhome" element={<ProductHome />} />
          <Route path="/supplier/addproducts" element={<SanoodaAddProduct />} />
          <Route
            path="/supplier/productdetails"
            element={<SanoodaProductDetails />}
          />
          <Route
            path="/supplier/productdetails/:id"
            element={<UpdateProduct />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
