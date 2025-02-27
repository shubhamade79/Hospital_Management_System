import React, { useState } from "react";
import "./contactus.css"; // Ensure your CSS styles for this component are available
import MobileHeader from "../components/MobileHeader";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  

  return (
    <div>
    {/* White Stripe */}
    {/* <LogoSection/> */}
    {/* Navbar */}
    <MobileHeader/>
    <div className="contact-support text-center">
        <h2>Contact Us</h2>
        <p>Have questions? We're here to help! Reach out to us below.</p>
      </div>
    <section className="contact-section">
      

      <div className="contact-form-container">
        {submitted ? (
          <p className="success-message">Thank you for reaching out! We'll get back to you soon.</p>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea name="message" value={formData.message} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        )}
      </div>
    </section>
    </div>
  );
};

export default ContactUs;
