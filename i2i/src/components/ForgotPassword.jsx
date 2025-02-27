import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
    const [hdmisNumber, setHdmisNumber] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [stage, setStage] = useState(1); // Stages: 1 - Enter ID, 2 - Verify OTP, 3 - Reset Password
    const [error, setError] = useState("");

    const fetchEmail = async () => {
        if (!hdmisNumber) {
            setError("Please enter HDMIS Number.");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/fetch-email`, { hdmisNumber });
            setEmail(response.data.email);
            setStage(2); // Move to OTP stage
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching email.");
        }
    };

    const sendOtp = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-otp`, { email });
            alert(response.data.message);
        } catch (error) {
            setError(error.response?.data?.message || "Error sending OTP.");
        }
    };

    const verifyOtp = async () => {
        if (!otp) {
            setError("Please enter the OTP.");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/verify-otp`, { email, otp });
            if (response.data.success) {
                setStage(3); // Move to Reset Password stage
            } else {
                setError("Invalid OTP.");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Error verifying OTP.");
        }
    };

    const resetPassword = async () => {
        if (!newPassword) {
            setError("Please enter a new password.");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/reset-password`, { hdmisNumber, newPassword });
            alert(response.data.message);
            setStage(1); // Reset back to the start
        } catch (error) {
            setError(error.response?.data?.message || "Error resetting password.");
        }
    };

    return (
        <div className="container">
            <h2>Forgot Password</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            {stage === 1 && (
                <div>
                    <input 
                        type="text" 
                        placeholder="Enter HDMIS Number" 
                        value={hdmisNumber} 
                        onChange={(e) => setHdmisNumber(e.target.value)} 
                    />
                    <button onClick={fetchEmail}>Find Email</button>
                </div>
            )}

            {stage === 2 && (
                <div>
                    <p>Email: {email}</p>
                    <button onClick={sendOtp}>Send OTP</button>
                    <input 
                        type="text" 
                        placeholder="Enter OTP" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                    />
                    <button onClick={verifyOtp}>Verify OTP</button>
                </div>
            )}

            {stage === 3 && (
                <div>
                    <input 
                        type="password" 
                        placeholder="Enter New Password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                    />
                    <button onClick={resetPassword}>Reset Password</button>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
