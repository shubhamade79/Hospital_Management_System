import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("user_id");

    if (storedUsername) setUsername(storedUsername);
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/hospital-login";
  };

  return (
    <div className="user-profile d-flex align-items-center">
      {username ? (
        <div className="d-flex align-items-center gap-3">
          <i className="bi bi-person-circle profile-icon"></i>
          <span className="username-text">
            {username} <small className="text">(ID: {userId})</small>
          </span>
          <button className="btn btn-danger btn-sm ms-3" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <Link to="/hospital-login" className="btn btn-primary btn-sm">
          Login
        </Link>
        
      )}
    </div>
  );
};

export default UserProfile;
