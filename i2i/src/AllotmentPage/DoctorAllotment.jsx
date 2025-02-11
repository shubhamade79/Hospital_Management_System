import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

// Function to generate a random doctor ID and password
const generateRandomString = (prefix, length) => {
  const numbers = "0123456789";
  let result = prefix;
  for (let i = 0; i < 3; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return result;
};

const DoctorAllotment = () => {
  const navigate = useNavigate();
  const admin_id = localStorage.getItem("user_id");

  const [doctorDetails, setDoctorDetails] = useState({
    doctor_id: generateRandomString("DOC", 6),
    name: "",
    specialization: "",
    phone: "",
    email: "",
    password: generateRandomString("PWD", 8),
    admin_id,
    hospital_name: "",
    hospital_address:"",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch hospital name based on admin_id
  useEffect(() => {
    const fetchHospitalName = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get-hospital-name", {
          params: { admin_id },
        });
        if (response.data.hospital_name && response.data.hospital_address && response.data.hospital_state && response.data.hospital_city) {
          setDoctorDetails((prevDetails) => ({
            ...prevDetails,
            hospital_name: response.data.hospital_name,
            hospital_address: response.data.hospital_address,
            hospital_state:response.data.hospital_state,
            hospital_city:response.data.hospital_city
          }));
        } else {
          setErrorMessage("Hospital name not found.");
        }
      } catch (error) {
        setErrorMessage("Error fetching hospital name.");
      }
    };

    fetchHospitalName();
  }, [admin_id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate contact number (only digits, max 10)
    if (name === "phone" && !/^\d{0,10}$/.test(value)) {
      return;
    }

    setDoctorDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post("http://localhost:5000/add-doctor", doctorDetails);
      if (response.data.success) {
        setSuccessMessage("Doctor registered successfully!");
        setTimeout(() => navigate("/admin-dashboard/:admin_id"), 2000);
      } else {
        setErrorMessage("Error registering doctor.");
      }
    } catch (error) {
      setErrorMessage("Error connecting to the server.");
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h2 className="text-center mb-4">Doctor Allotment</h2>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        {successMessage && <p className="text-success">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="doctor_id">Doctor ID</label>
            <input
              type="text"
              className="form-control"
              id="doctor_id"
              name="doctor_id"
              value={doctorDetails.doctor_id}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Doctor's Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={doctorDetails.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="specialization">Specialization</label>
            <input
              type="text"
              className="form-control"
              id="specialization"
              name="specialization"
              value={doctorDetails.specialization}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Contact</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={doctorDetails.phone}
              onChange={handleChange}
              required
              placeholder="Enter 10-digit phone number"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={doctorDetails.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              className="form-control"
              id="password"
              name="password"
              value={doctorDetails.password}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="start_time">Start Time</label>
            <input
              type="time"
              className="form-control"
              id="start_time"
              name="start_time"
              value={doctorDetails.start_time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="end_time">End Time</label>
            <input
              type="time"
              className="form-control"
              id="end_time"
              name="end_time"
              value={doctorDetails.end_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="hospital_name">Hospital Name</label>
            <input
              type="text"
              className="form-control"
              id="hospital_name"
              name="hospital_name"
              value={doctorDetails.hospital_name}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="hospital_address">Hospital Address</label>
            <input
              type="text"
              className="form-control"
              id="hospital_address"
              name="hospital_address"
              value={doctorDetails.hospital_address}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="hospital_city">Hospital City</label>
            <input
              type="text"
              className="form-control"
              id="hospital_city"
              name="hospital_city"
              value={doctorDetails.hospital_city}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="hospital_state">Hospital State</label>
            <input
              type="text"
              className="form-control"
              id="hospital_state"
              name="hospital_state"
              value={doctorDetails.hospital_state}
              disabled
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Register Doctor
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorAllotment;
