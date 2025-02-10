import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container text-center">
        <div className="footer-social">
          <a href="#"><FaFacebook size={24} /></a>
          <a href="#"><FaTwitter size={24} /></a>
          <a href="#"><FaLinkedin size={24} /></a>
        </div>
        <p className="mt-4">&copy; 2024 HDMIS. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
