import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

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
    hospital_address: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchHospitalName = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-hospital-name`, {
          params: { admin_id },
        });
        if (response.data.hospital_name && response.data.hospital_address) {
          setDoctorDetails((prevDetails) => ({
            ...prevDetails,
            hospital_name: response.data.hospital_name,
            hospital_address: response.data.hospital_address,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && !/^[0-9]{0,10}$/.test(value)) return;
    setDoctorDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/add-doctor`, doctorDetails);
      if (response.data.success) {
        setSuccessMessage("Doctor registered successfully!");
        setTimeout(() => navigate(`/admin-dashboard/${admin_id}`), 2000);
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
      <div className="container d-flex justify-content-center">
                <div className="card p-4 shadow-lg" style={{ width: "40rem" }}>
              <h3 className="text-center mb-4">Doctor Allotment</h3>
              {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
              {successMessage && <p className="text-success text-center">{successMessage}</p>}
              <form onSubmit={handleSubmit}>
                {Object.entries(doctorDetails).map(([key, value]) => (
                  <div className="form-group mb-3" key={key}>
                    <label htmlFor={key} className="fw-bold text-capitalize">
                      {key.replace("_", " ")}
                    </label>
                    <input
                      type={key === "email" ? "email" : key.includes("time") ? "time" : "text"}
                      className="form-control"
                      id={key}
                      name={key}
                      value={value}
                      onChange={handleChange}
                      required={!["doctor_id", "password", "hospital_name", "hospital_address","admin_id"].includes(key)}
                      disabled={["doctor_id", "password", "hospital_name", "hospital_address","admin_id"].includes(key)}
                    />
                  </div>
                ))}
                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Register Doctor
                </button>
              </form>
            </div>
          </div>
        </div>

  );
};

export default DoctorAllotment;
