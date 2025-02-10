import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import "../Home/style1.css";
import MobileHeader from "../components/MobileHeader";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const HospitalLogin = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const [selectedRole, setSelectedRole] = useState("");
  const [idPlaceholder, setIdPlaceholder] = useState("");
  const [hdmisNumber, setHdmisNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRoleChange = (e) => {
    const selected = e.target.value;
    setSelectedRole(selected);
    setIdPlaceholder(selected === "Doctor" ? "Doctor's ID" : "Hospital ID");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
  
    try {
      const response = await axios.post("http://localhost:5000/hospitalLogin", {
        user_id: hdmisNumber,
        password: password,
        role: selectedRole,
      });
  
      if (response.data.user) {
        alert("Login successful!");
  
        // Clear old session data to avoid conflicts
        localStorage.clear();
  
        // Store new session data
        localStorage.setItem("user_id", response.data.user.user_id);
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("username", response.data.user.full_name);
  
        // Store additional data based on role
        if (selectedRole === "Doctor") {
          localStorage.setItem("doctor_id", response.data.user.user_id);
          navigate(`/doctor-dashboard/${response.data.user.user_id}`);
        } else if (selectedRole === "Reception") {
          localStorage.setItem("reception_id", response.data.user.user_id);
          navigate(`/reception-appoinment/${response.data.user.user_id}`);
        } else if (selectedRole === "Hospital Admin") {
          localStorage.setItem("admin_id", response.data.user.user_id);
          navigate(`/admin-dashboard/${response.data.user.user_id}`);
        }
      } else {
        setErrorMessage("User not found or invalid credentials");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };
  

  return (
    <div>
      <MobileHeader />
      <div className="container login-container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="box-login">
              <div className="text-center mb-4">
                <h2>HDMIS | Hospital Login</h2>
              </div>
              <form onSubmit={handleLogin} className="form-login">
                <fieldset>
                  <legend className="text-center">Sign in to your account</legend>
                  <p className="text-muted text-center">
                    Please enter your ID and password to log in.
                  </p>

                  <div className="form-group mb-3">
                    <div className="input-group">
                      <span className="input-group-text"><i className="fas fa-user-tag"></i></span>
                      <select
                        id="loginAs"
                        className="form-select"
                        value={selectedRole}
                        onChange={handleRoleChange}
                        required
                      >
                        <option value="" disabled>
                          Login as
                        </option>
                        <option value="Doctor">Doctor</option>
                        <option value="Reception">Reception</option>
                        <option value="Hospital Admin">Hospital Admin</option>
                      </select>
                    </div>
                  </div>

                  {selectedRole && (
                    <div className="form-group mb-3">
                      <div className="input-group">
                        <span className="input-group-text"><i className="fas fa-id-badge"></i></span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={idPlaceholder}
                          value={hdmisNumber}
                          onChange={(e) => setHdmisNumber(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="form-group mb-3">
                    <div className="input-group">
                      <span className="input-group-text"><i className="fas fa-lock"></i></span>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="text-end mt-2">
                      <a href="forgot-password.php">Forgot Password?</a>
                    </div>
                  </div>

                  {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

                  <div className="form-actions text-center">
                    <button type="submit" className="btn btn-primary w-100">
                      Login <i className="fas fa-arrow-circle-right"></i>
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalLogin;
