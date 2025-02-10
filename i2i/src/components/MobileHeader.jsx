import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../../src/HDMIS_IMGS/IMG_HDMIS_7_-_Copy-removebg-preview.svg";
import './MobileHeader.css';

const MobileHeader = () => {
  return (
    <header className="mobile-header">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          {/* Logo on the left */}
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="HDMIS Logo" className="navbar-logo" />
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
              <a className="nav-link" href="#Aboutsection">About us</a>
              </li>
              <li className="nav-item">
              <a className="nav-link" href="#Support">Support</a>
              </li>
              
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MobileHeader;
