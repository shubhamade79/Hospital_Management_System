import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style1.css";
import logo from "../../src/HDMIS_IMGS/IMG_HDMIS_7_-_Copy-removebg-preview.svg";
import image from "../../src/HDMIS_IMGS/IMG_HDMIS 1.svg";
import Logins from "./Logins"; 
import Footer from "./Footer"; 
import Support from "./Support"; 
import About from "./About"; 
import MobileHeader from "../components/MobileHeader";

const HDMISHomePage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("user_id");
    const storedRole = localStorage.getItem("role"); // Get role from localStorage
    const patientData = localStorage.getItem("patient");

    let patient = null;
    try {
      patient = patientData ? JSON.parse(patientData) : null;
    } catch (error) {
      console.error("Error parsing patient data:", error);
    }

    if (patient) {
      setUserData({ name: patient.full_name, id: patient.patient_id, role: "Patient" });
    } else if (storedUsername && storedUserId && storedRole) {
      setUserData({ name: storedUsername, id: storedUserId, role: storedRole });
    }
  }, []);

  return (
    <div style={{ backgroundColor: "#16404D" }}>
      <MobileHeader />

      <div className="carousel-container">
        <div className="carousel-wrapper">
          <div className="carousel-slide">
            <div className="hero d-flex align-items-center">
              <div className="container">
                <div className="row">
                  {/* Left Section: Text Content */}
                  <div className="col-md-6 text-left">
                    <h1>HDMIS - A Digital Health Initiative</h1>
                    <h2>Your Digital Health Journey Begins Here</h2>

                    {/* Show button if user is Receptionist OR if no user is logged in */}
                    {!userData || userData?.role === "Reception" ? (
                      <Link
                        to="/create-hdmish-number"
                        className="btn btn-primary btn-lg mt-3 text-white text-decoration-none"
                      >
                        Create HDMIS Number
                      </Link>
                    ) : null}
                  </div>

                  {/* Right Section: Image */}
                  <div className="col-md-6 text-center">
                    <img src={image} alt="Hero Banner" className="img-fluid hero-image" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="Aboutsection">
        <About />
      </div>

      {/* Logins Section: Only show if NOT logged in */}
      {!userData && <Logins />}

      {/* Support Section */}
      <div id="Support">
        <Support />
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default HDMISHomePage;
