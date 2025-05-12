import React from "react";
// import "./navKasun.css";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <div>
      <ul className="Home-ul">
        <li className="home-ll">
          <Link to="/website/mainhome" className="active home-a">
            <h1>Home</h1>
          </Link>
        </li>

        <li className="home-ll">
          <Link to="/website/productdetails" className="active home-a">
            <h1>All Products</h1>
          </Link>
        </li>

        <li className="home-ll">
          <Link to="/website/addfeedback" className="active home-a">
            <h1>Add Feedback</h1>
          </Link>
        </li>

        <li className="home-ll">
          <Link to="/website/feedbacks" className="active home-a">
            <h1> Feedback Details</h1>
          </Link>
        </li>

        <li className="home-ll">
          <Link to="/website/conus" className="active home-a">
            <h1>Contact Us</h1>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Nav;
