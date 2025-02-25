import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../src/HDMIS_IMGS/IMG_HDMIS_7_-_Copy-removebg-preview.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./MobileHeader.css";

const MobileHeader = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("user_id");
    const storedRole = localStorage.getItem("role");

    // Get patient data from localStorage
    const patientData = localStorage.getItem("patient");
    let patient = null;

    try {
      patient = patientData ? JSON.parse(patientData) : null;
    } catch (error) {
      console.error("Error parsing patient data:", error);
    }

    // Set user data
    if (patient) {
      setUserData({ name: patient.full_name, id: patient.patient_id, role: "Patient" });
    } else if (storedUsername && storedUserId && storedRole) {
      setUserData({ name: storedUsername, id: storedUserId, role: storedRole });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserData(null);
    window.location.href = "/"; // Redirect to homepage after logout
  };

  // Define dashboard routes based on roles
  const getDashboardRoute = () => {
    if (!userData?.id) return "/";

    switch (userData.role) {
      case "Patient":
        return "/patient-dashboard";
      case "Doctor":
        return `/doctor-dashboard/${userData.id}`;
      case "Reception":
        return `/reception-appoinment/${userData.id}`;
      case "Hospital Admin":
        return `/admin-dashboard/${userData.id}`;
      default:
        return "/";
    }
  };

  return (
    <header className="bg-black">
      <nav className="navbar navbar-expand-lg bg-black py-2">
        <div className="container-fluid px-0">
          {/* Logo */}
          <Link className="navbar-logo" to="/">
            <img src={logo} alt="HDMIS Logo" className="max-w-[100px] h-auto" />
          </Link>

          {/* Navbar Toggler */}
          <button
            className="navbar-toggler bg-white"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-0">
              <li className="nav-item">
                <Link className="nav-link text-white text-lg font-medium px-4 py-2 hover:text-yellow-500" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white text-lg font-medium px-4 py-2 hover:text-yellow-500" href="/#Aboutsection">
                  About us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white text-lg font-medium px-4 py-2 hover:text-yellow-500" href="/#Support">
                  Support
                </a>
              </li>
            </ul>

            {/* Right Side: Show Dashboard & Logout for Logged-in Users */}
            <ul className="navbar-nav ml-10">
              {userData ? (
                <li className="nav-item d-flex align-items-center">
                  <i className="bi bi-person-circle profile-icon text-white"></i>

                  {/* Clickable Username to Open Profile */}
                  <Link
                    to={`/profile/${userData.id}`}
                    className="text-white px-3 text-decoration-none"
                    style={{ cursor: "pointer" }}
                  >
                    {userData.name} (ID: {userData.id}, {userData.role})
                  </Link>

                  {/* Dashboard Button */}
                  <Link to={getDashboardRoute()} className="btn btn-warning btn-sm mx-2">
                    Dashboard
                  </Link>

                  {/* Logout Button */}
                  <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/patient-login">
                      <button className="btn btn-success btn-sm">Patient Login</button>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/hospital-login">
                      <button className="btn btn-success btn-sm">Hospital Login</button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MobileHeader;
