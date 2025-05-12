import React, { useRef, useState } from "react";
import Nav from "../Nav/NavAsiri";
import emailjs from "@emailjs/browser";
import { FaPaperPlane } from "react-icons/fa";
import '../Asiri.css';

function StockRequest() {
  const form = useRef();
  const [message, setMessage] = useState({ type: "", text: "" });

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_urkojjd",
        "template_yg6rzug",
        form.current,
        "7gTUjovPcKx2iL7CM"
      )
      .then(
        (result) => {
          console.log(result.text);
          setMessage({
            type: "success",
            text: "Request sent successfully! We'll process it shortly."
          });
          form.current.reset();
        },
        (error) => {
          console.log(error.text);
          setMessage({
            type: "error",
            text: "Failed to send request. Please try again."
          });
        }
      );
  };

  return (
    <div className="stock-request-container">
      <Nav />

      <div className="stock-request-form">
        <h2 className="request-title">Stock Request Form</h2>
        <p className="request-subtitle">
          Fill out the form below to request additional stock for your products
        </p>

        {message.text && (
          <div className={`form-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form ref={form} onSubmit={sendEmail}>
          <div className="form-group">
            <label htmlFor="product_id">Product ID</label>
            <input
              type="text"
              id="product_id"
              name="product_id"
              className="form-input"
              placeholder="Enter Product ID"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              className="form-input"
              placeholder="Enter Quantity"
              min="1"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            <FaPaperPlane /> Send Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default StockRequest;
