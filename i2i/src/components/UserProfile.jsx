import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("user_id"); // Fetch the correct user ID

    // console.log("Stored Username:", storedUsername); // Debugging
    // console.log("Stored User ID:", storedUserId); // Debugging

    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/hospital-login";
  };

  return (
    <div className="user-profile">
      {username ? (
        <div className="d-flex align-items-center">
          <span className="me-3">Welcome,  (ID: {userId})</span>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login" className="btn btn-primary btn-sm">
          Login
        </Link>
      )}
    </div>
  );
};

export default UserProfile;
