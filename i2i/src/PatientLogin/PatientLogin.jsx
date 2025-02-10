import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import './style1.css';
import MobileHeader from "../components/MobileHeader";
import { Link } from "react-router-dom";

const PatientLogin = () => {
    const [hdmisNumber, setHdmisNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate(); // ✅ Move useNavigate to the top level

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!hdmisNumber || !password) {
            setError("Both fields are required");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/login", {
                hdmis_number: hdmisNumber,
                password: password
            });

            const { message, patient } = response.data;

            // Store user details in localStorage
            localStorage.setItem("patient", JSON.stringify(patient));

            alert(message);
            navigate("/patient-dashboard"); // ✅ Correctly using navigate now
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div>
            {/* Navbar */}
            <MobileHeader/>

            {/* Login Form */}
            <div className="container login-container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="box-login p-4 shadow rounded">
                            <div className="text-center mb-4">
                                <h2>HDMIS | Patient Login</h2>
                            </div>
                            <form className="form-login" onSubmit={handleSubmit}>
                                <fieldset>
                                    <legend className="text-center">Sign in to your account</legend>
                                    <p className="text-muted text-center">Enter your HDMIS number and password to log in.</p>

                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <div className="form-group mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="fas fa-user"></i></span>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="hdmis_number" 
                                                placeholder="HDMIS Number" 
                                                value={hdmisNumber}
                                                onChange={(e) => setHdmisNumber(e.target.value)}
                                                required 
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="fas fa-lock"></i></span>
                                            <input 
                                                type="password" 
                                                className="form-control" 
                                                name="password" 
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

                                    <div className="form-actions text-center">
                                        <button type="submit" className="btn btn-primary w-100">
                                            Login <i className="fas fa-arrow-circle-right"></i>
                                        </button>
                                    </div>
                                    <div className="new-account text-center mt-3">
                                        Don't have an account yet? <Link to="/registration">Create an account</Link>
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

export default PatientLogin;
