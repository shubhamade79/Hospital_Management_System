import React from 'react';
import './BenefitsSection.css'; // Importing the CSS file
import image1 from "../HDMIS_IMGS/IMG_HDMIS 2.svg";
import image2 from "../HDMIS_IMGS/IMG_HDMIS 3.svg";
import image3 from "../HDMIS_IMGS/IMG_HDMIS 4.svg";
import image4 from "../HDMIS_IMGS/IMG_HDMIS 5.svg";
const BenefitsSection = () => {
  return (
    <section className="benefits-section">
      <h1>Benefits of HDMIS Number</h1>
      <p>
        HDMIS number is a 14-digit number that will uniquely identify you as a participant in India’s digital
        healthcare ecosystem...
      </p>
      <div className="cards">
        <div className="card">
          <img src={image1} alt="Identity Icon" />
          <h3>Unique & Trustable Identity</h3>
          <p>Establish unique identity across different healthcare providers within the healthcare ecosystem.</p>
        </div>
        <div className="card">
          <img src={image2} alt="Benefits Icon" />
          <h3>Unified Benefits</h3>
          <p>Link all healthcare benefits ranging from public health programmes to insurance schemes.</p>
        </div>
        <div className="card">
          <img src={image3} alt="Access Icon" />
          <h3>Hassle-free Access</h3>
          <p>Avoid long lines for registration in healthcare facilities across the country.</p>
        </div>
        <div className="card">
          <img src={image4} alt="PHR Icon" />
          <h3>Easy PHR Sign Up</h3>
          <p>Seamless sign-up for PHR (Personal Health Records) applications for health data sharing.</p>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
