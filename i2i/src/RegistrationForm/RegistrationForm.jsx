import React, { useState } from 'react';
import './RegistrationForm.css';
import LogoSection from "../components/LogoSection ";
import MobileHeader from "../components/MobileHeader";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: true,
  });
  
  const [emailStatus, setEmailStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Password and Confirm Password do not match!');
      return;
    }
    // Handle form submission logic (e.g., API call)
  };

  const checkEmailAvailability = () => {
    // Assuming an API call would be made to check if the email exists
    setEmailStatus('Checking email...');
    setTimeout(() => setEmailStatus('Email available!'), 1000);
  };

  return (
    <div>
      {/* White Stripe */}
      {/* <LogoSection/> */}

      {/* Navbar */}
      <MobileHeader/>
    <div className="registration-container">
      <div className="form-container">
        <h2>HMS | Patient Registration</h2>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Sign Up</legend>
            <p>Enter your personal details below:</p>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <div className="gender-options">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                />
                <label htmlFor="female">Female</label>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                />
                <label htmlFor="male">Male</label>
              </div>
            </div>

            <p>Enter your account details below:</p>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onBlur={checkEmailAvailability}
                required
              />
              <span>{emailStatus}</span>
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="agree"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                />
                <label htmlFor="agree">I agree</label>
              </div>
            </div>
            <div className="form-actions">
              <p>
                Already have an account? <a href="/patient-login">Log-in</a>
              </p>
              <button type="submit" className="btn btn-primary">
                Submit <i className="fa fa-arrow-circle-right"></i>
              </button>
            </div>
          </fieldset>
        </form>
        <div className="copyright">
          &copy; <span className="current-year"></span><span className="text-bold text-uppercase"> HMS</span>. <span>All rights reserved</span>
        </div>
      </div>
    </div>
    </div>

  );
};

export default RegistrationForm;
