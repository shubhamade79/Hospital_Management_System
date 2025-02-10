import React from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import './style1.css';
import logo from "../../src/HDMIS_IMGS/IMG_HDMIS_7_-_Copy-removebg-preview.svg"
import image from "../../src/HDMIS_IMGS/IMG_HDMIS 1.svg"
import Logins from './Logins'; // Assuming it's in the same folder
import Footer from './Footer'; // Assuming it's in the same folder
import Support from './Support'; // Import the Support component
import About from './About';  // Import the About component
import LogoSection from "../components/LogoSection ";
import MobileHeader from "../components/MobileHeader";


const HDMISHomePage = () => {
  return (
    <div style={{ backgroundColor: "#16404D" }}>
      {/* White Stripe */}
      {/* <LogoSection/> */}
      {/* Navbar */}
      <MobileHeader/>

      {/* Hero Section */}
      <div className="hero d-flex align-items-center text-white text-center p-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h1>HDMIS - Creating India's Digital Health Mission</h1>
              <h2>Your Digital Health Journey Begins Here</h2>
              <Link to="/create-hdmish-number" className="btn btn-primary btn-lg text-white text-decoration-none">
                Create HDMIS Number
              </Link>
              {/* <h6>Already have HDMIS number? <Link to="/login" className="text-white text-decoration-none">Login</Link></h6> */}
            </div>
            <div className="col-md-6 text-center">
              <img src={image} alt="Hero Banner" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
      {/* About Section */}
      <div id="Aboutsection">
        <About />
      </div>
      {/* Logins Section */}
      <Logins />
      <div id="Support">

      {/* Support (FAQ) Section */}
      <Support /></div>
      
      {/* Footer Section */}
      <Footer />
    </div>
  );
};


export default HDMISHomePage;
