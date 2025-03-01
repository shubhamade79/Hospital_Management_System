import React from "react";
import UserProfile from "./UserProfile"; // Import the component
import { Link } from 'react-router-dom';
import logo from "../../src/HDMIS_IMGS/IMG_HDMIS_7_-_Copy-removebg-preview.svg";
import "./MobileHeader.css";

const Header = () => {
  return (
    <header className="d-flex justify-content-between p-3 bg-dark text-white">
      {/* <h3>HDMIS System</h3> */}
      <Link className="navbar-logo " to="/">
          <img src={logo} alt="HDMIS Logo" className="max-w-[100px] h-auto" />
      </Link>
      <UserProfile /> {/* Display the logged-in user's name */}
    </header>
  );
};

export default Header;
