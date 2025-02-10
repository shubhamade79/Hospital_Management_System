import React from 'react';
import './LogoSection.css'; // We'll add the CSS styles in this file
import logo1 from "../../src/HDMIS_IMGS/IMG_HDMIS_7_-_Copy-removebg-preview.svg"

const LogoSection = ({ logo }) => {
  return (
    <div className="logo-section">
      <div className="white-stripe d-flex justify-content-between align-items-center p-3">
        <img className="logo-image" src={logo1} alt="HDMIS Logo" />
      </div>
    </div>
  );
};

export default LogoSection;
