import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style1.css";
import MobileHeader from "../components/MobileHeader";
import { Link } from "react-router-dom";

const PatientLogin = () => {
    const [hdmisNumber, setHdmisNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [forgotPassword, setForgotPassword] = useState(false);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const navigate = useNavigate();

    // Handle login submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!hdmisNumber || !password) {
            setError("Both fields are required");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/login", {
                hdmis_number: hdmisNumber,
                password
            });

            localStorage.setItem("patient", JSON.stringify(response.data.patient));

            alert(response.data.message);
            navigate("/patient-dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong.");
        }
    };

    // Handle forgot password request
    const handleForgotPassword = async () => {
        if (!hdmisNumber) {
            setError("Please enter your HDMIS number.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/forgot-password_patient", { hdmis_number: hdmisNumber });
            alert(response.data.message);
            setOtpSent(true);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to send OTP.");
        }
    };

    // Handle password reset request
    const handleResetPassword = async () => {
        if (!otp || !newPassword) {
            setError("OTP and new password are required.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/reset-password_patient", {
                hdmis_number: hdmisNumber,
                otp,
                new_password: newPassword
            });

            alert(response.data.message);
            setForgotPassword(false);
            setOtpSent(false);
            setOtp("");
            setNewPassword("");
        } catch (error) {
            setError(error.response?.data?.message || "Failed to reset password.");
        }
    };

    return (
        <div>
            <MobileHeader />
            <div className="container login-container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="box-login p-4 shadow rounded">
                            <div className="text-center mb-4">
                                <h2>HDMIS | Patient Login</h2>
                            </div>

                            {/* Login Form */}
                            {!forgotPassword ? (
                                <form onSubmit={handleSubmit}>
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    
                                    <div className="form-group mb-3">
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="HDMIS Number" 
                                            value={hdmisNumber} 
                                            onChange={(e) => setHdmisNumber(e.target.value)} 
                                            required 
                                        />
                                    </div>

                                    <div className="form-group mb-3">
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
                                        <button type="button" className="btn btn-link" onClick={() => setForgotPassword(true)}>
                                            Forgot Password?
                                        </button>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100">
                                        Login
                                    </button>

                                    <div className="new-account text-center mt-3">
                                        Don't have an account yet? <Link to="/create-hdmish-number">Create an account</Link>
                                    </div>
                                </form>
                            ) : (
                                // Forgot Password Form
                                <div>
                                    <h4 className="text-center">Reset Password</h4>
                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <div className="form-group mb-3">
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="HDMIS Number" 
                                            value={hdmisNumber} 
                                            onChange={(e) => setHdmisNumber(e.target.value)} 
                                            required 
                                        />
                                    </div>

                                    {!otpSent ? (
                                        <button onClick={handleForgotPassword} className="btn btn-warning w-100">
                                            Send OTP
                                        </button>
                                    ) : (
                                        <div>
                                            <div className="form-group mb-3">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Enter OTP" 
                                                    value={otp} 
                                                    onChange={(e) => setOtp(e.target.value)} 
                                                    required 
                                                />
                                            </div>

                                            <div className="form-group mb-3">
                                                <input 
                                                    type="password" 
                                                    className="form-control" 
                                                    placeholder="New Password" 
                                                    value={newPassword} 
                                                    onChange={(e) => setNewPassword(e.target.value)} 
                                                    required 
                                                />
                                            </div>

                                            <button onClick={handleResetPassword} className="btn btn-success w-100">
                                                Reset Password
                                            </button>
                                        </div>
                                    )}

                                    <div className="text-center mt-3">
                                        <button className="btn btn-link" onClick={() => setForgotPassword(false)}>
                                            Back to Login
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientLogin;
