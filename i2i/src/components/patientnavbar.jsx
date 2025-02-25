import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import logo from "../../src/HDMIS_IMGS/IMG_HDMIS_7_-_Copy-removebg-preview.svg";

const PatientNavbar = () => {
  const navigate = useNavigate(); // Initialize navigation

  // Get patient data from localStorage
  const patientData = localStorage.getItem("patient");
  const patient = patientData ? JSON.parse(patientData) : null;

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("patient"); // Clear patient session
    navigate("/patient-login"); // Redirect to login page
  };

  return (
    <header className="d-flex justify-content-between p-3 bg-dark text-white align-items-center">
      {/* ✅ HDMIS Logo */}
      <Link className="navbar-logo" to="/">
        <img src={logo} alt="HDMIS Logo" className="max-w-[100px] h-auto" />
      </Link>

      {/* ✅ User Profile Section */}
      <div className="d-flex align-items-center">
        {patient ? (
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-person-circle profile-icon"></i>
            <span className="username-text">
              {patient.full_name} <small className="text">(ID: {patient.patient_id})</small>
            </span>
            <button className="btn btn-danger btn-sm ms-3" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/patient-login" className="btn btn-primary btn-sm">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default PatientNavbar;
