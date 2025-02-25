import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import "../Home/style1.css";
import MobileHeader from "../components/MobileHeader";
import { useNavigate } from "react-router-dom"; 
import { Modal, Button } from "react-bootstrap"; // Import Modal and Button from Bootstrap

const HospitalLogin = () => {
  const navigate = useNavigate(); 

  const [selectedRole, setSelectedRole] = useState("");
  const [idPlaceholder, setIdPlaceholder] = useState("");
  const [hdmisNumber, setHdmisNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false); // State for modal
  const [forgotRole, setForgotRole] = useState("");
  const [forgotUserId, setForgotUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [stage, setStage] = useState(1); // Stages for forgot password process
  const [userEmail, setUserEmail] = useState(""); // Add this state

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

        localStorage.clear();

        localStorage.setItem("user_id", response.data.user.user_id);
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("username", response.data.user.full_name);

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

  // Forgot Password Handlers
  const handleForgotPasswordClick = () => {
    setShowForgotModal(true);
    setStage(1);
  };

  const fetchEmail = async () => {
    if (!forgotUserId || !forgotRole) {
        alert("Please enter User ID and select a Role.");
        return;
    }

    try {
        const response = await axios.post("http://localhost:5000/send-otp", {
            id: forgotUserId,
            role: forgotRole,
        });

        if (response.data.success) {
            alert("OTP has been sent to your registered email.");
            setUserEmail(response.data.email);  // Store email for later verification
            setStage(2);
        } else {
            alert("User not found.");
        }
    } catch (error) {
        alert("Error sending OTP. Please try again.");
    }
};


const verifyOtp = async () => {
  if (!otp || !userEmail) {
      alert("Please enter the OTP and ensure email is correct.");
      return;
  }

  console.log("Verifying OTP for:", userEmail, "Entered OTP:", otp);

  try {
      const response = await axios.post("http://localhost:5000/verify-otp", {
          email: userEmail.trim(),
          otp: otp,
      });

      console.log("OTP Verification Response:", response.data);

      if (response.data.success) {
          alert("OTP verified successfully.");
          setStage(3);
      } else {
          alert("Invalid OTP. Please try again.");
      }
  } catch (error) {
      console.error("OTP Verification Error:", error.response?.data || error.message);
      alert("Error verifying OTP: " + (error.response?.data?.message || "Server error"));
  }
};




const resetPassword = async () => {
  if (!newPassword) {
      alert("Please enter a new password.");
      return;
  }

  try {
      const response = await axios.post("http://localhost:5000/reset-password", {
          id: forgotUserId,
          role: forgotRole,
          newPassword: newPassword,
      });

      if (response.data.success) {
          alert("Password reset successfully.");
          setShowForgotModal(false);
      } else {
          alert("Error resetting password.");
      }
  } catch (error) {
      console.error("Password Reset Error:", error.response?.data || error.message);
      alert("Error resetting password.");
  }
};


  return (
    <div>
      <MobileHeader />
      <div className="container login-container">
        <div className="row justify-content-center">
          <div className="">
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
                      <a href="#" onClick={handleForgotPasswordClick}>Forgot Password?</a>
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

      {/* Forgot Password Modal */}
      <Modal show={showForgotModal} onHide={() => setShowForgotModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {stage === 1 ? (
            <>
              <label>Select Role</label>
              <select className="form-select mb-2" value={forgotRole} onChange={(e) => setForgotRole(e.target.value)}>
                <option value="">Choose Role</option>
                <option value="Doctor">Doctor</option>
                <option value="Reception">Reception</option>
                <option value="Hospital Admin">Hospital Admin</option>
              </select>
              <input type="text" className="form-control mb-2" placeholder="Enter User ID" value={forgotUserId} onChange={(e) => setForgotUserId(e.target.value)} />
              <Button onClick={fetchEmail}>Fetch Email</Button>
            </>
          ) : stage === 2 ? (
            <>
              <input type="text" className="form-control mb-2" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <Button onClick={verifyOtp}>Verify OTP</Button>
            </>
          ) : (
            <>
              <input type="password" className="form-control mb-2" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <Button onClick={resetPassword}>Reset Password</Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HospitalLogin;
