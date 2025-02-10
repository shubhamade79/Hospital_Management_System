import React from "react";
import UserProfile from "./UserProfile"; // Import the component

const Header = () => {
  return (
    <header className="d-flex justify-content-between p-3 bg-dark text-white">
      <h3>HDMIS System</h3>
      <UserProfile /> {/* Display the logged-in user's name */}
    </header>
  );
};

export default Header;
