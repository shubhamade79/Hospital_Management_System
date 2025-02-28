import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import MobileHeader from "../components/MobileHeader";
import "./style1.css";
import { useState } from "react";

const CreateHDMISNumber = () => {
    const [aadhaar, setAadhaar] = useState(["", "", ""]);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [hdmisNumber, setHdmisNumber] = useState("");
    const [submittedName, setSubmittedName] = useState("");
    const [useAadhaar, setUseAadhaar] = useState(true);
    const sendHdmisEmail = async (hdmisNumber) => {
                try {
                    await axios.post(`${process.env.REACT_APP_API_URL}/sendHdmisEmail`, { email, hdmis_number: hdmisNumber });
                    alert("HDMIS ID sent successfully via Email!");
                } catch (error) {
                    alert("Failed to send HDMIS ID.");
                }
            };
        
    // 1️⃣ Function to fetch email based on Aadhaar
    const fetchEmailFromAadhaar = async (aadhaar_number) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/getAadhaarDetails`, { aadhaar_number });

            if (response.data.email) {
                setEmail(response.data.email);
                sendOtp(response.data.email);  // Trigger OTP sending
            } else {
                alert("Aadhaar not found");
            }
        } catch (error) {
            alert("Failed to fetch Aadhaar details.");
        }
    };
    const handleSubmit = async () => {
                if (useAadhaar) {
                    const aadhaar_number = aadhaar.join("");
                    if (aadhaar_number.length !== 12 || !fullName || !password) {
                        alert("Please fill all fields correctly");
                        return;
                    }
                    try {
                        const response = await axios.post(`${process.env.REACT_APP_API_URL}/storeAadhaar`, {
                            aadhaar_number, full_name: fullName, password
                        });
        
                        if (response.data.hdmis_number) {
                            setHdmisNumber(response.data.hdmis_number);
                            setSubmittedName(fullName);
                            sendHdmisEmail(response.data.hdmis_number);
                        } else {
                            alert("Failed to generate HDMIS number");
                        }
                    } catch (error) {
                        alert("Failed to store user data");
                    }
                } else {
                    if (!fullName || !email || !phoneNumber || !password) {
                        alert("Please fill all fields correctly");
                        return;
                    }
                    try {
                        const response = await axios.post(`${process.env.REACT_APP_API_URL}/storeManualUser`, {
                            full_name: fullName, email, phone_number: phoneNumber, password
                        });
        
                        if (response.data.hdmis_number) {
                            setHdmisNumber(response.data.hdmis_number);
                            setSubmittedName(fullName);
                            sendHdmisEmail(response.data.hdmis_number);
                        } else {
                            alert("Failed to generate HDMIS number");
                        }
                    } catch (error) {
                        alert("Failed to store user data");
                    }
                }
            };
    // 2️⃣ Function to send OTP to fetched email
    const sendOtp = async (email) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-otp`, { id: email, role: "user" });
            if (response.data.success) {
                alert("OTP sent to email.");
                setIsOtpSent(true);
            } else {
                alert("Failed to send OTP.");
            }
        } catch (error) {
            alert("Error sending OTP.");
        }
    };

    // 3️⃣ Function to verify OTP
    const verifyOtp = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/verify-otp`, { email, otp });

            if (response.data.success) {
                alert("OTP verified successfully!");
                setIsOtpVerified(true);
                fetchUserData(); // Fetch user details after OTP verification
            } else {
                alert("Invalid OTP");
            }
        } catch (error) {
            alert("OTP verification failed.");
        }
    };

    // 4️⃣ Fetch user details after OTP verification
    const fetchUserData = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/getAadhaarDetails`, { aadhaar_number: aadhaar.join("") });

            if (response.data.full_name) {
                setFullName(response.data.full_name);
                setPhoneNumber(response.data.phone_number);
            } else {
                alert("Aadhaar details not found");
            }
        } catch (error) {
            alert("Error fetching user details.");
        }
    };

    // 5️⃣ Handle Aadhaar input and trigger email fetching
    const handleAadhaarChange = (i, value) => {
        const newAadhaar = [...aadhaar];
        newAadhaar[i] = value;
        setAadhaar(newAadhaar);
    
        // Reset OTP states if Aadhaar is modified
        setIsOtpSent(false);
        setIsOtpVerified(false);
        setOtp("");
        setEmail("");
        setFullName("");
        setPhoneNumber("");
    
        // Check if Aadhaar is complete (12 digits) before fetching email
        if (newAadhaar.join("").length === 12) {
            fetchEmailFromAadhaar(newAadhaar.join(""));
        }
    };
    

    return (
        <div>
            <MobileHeader />
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card shadow-lg p-4 rounded-4" style={{ width: "450px" }}>
                    <h2 className="text-center mb-4">Create HDMIS Number</h2>

                    {/* Toggle Aadhaar or Manual Entry */}
                    <div className="text-center mb-3">
                        <button className={`btn ${useAadhaar ? "btn-primary" : "btn-secondary"} me-2`} onClick={() => setUseAadhaar(true)}>Use Aadhaar</button>
                        <button className={`btn ${!useAadhaar ? "btn-primary" : "btn-secondary"}`} onClick={() => setUseAadhaar(false)}>Without Aadhaar</button>
                    </div>

                    {useAadhaar ? (
                        <>
                            <h5>Enter Aadhaar Number</h5>
                            <div className="mb-3">
                                <label className="form-label">Aadhaar Number *</label>
                                <div className="input-group">
                                    {aadhaar.map((num, i) => (
                                        <input key={i} type="text" maxLength="4" className="form-control text-center"
                                            placeholder="0000"
                                            value={aadhaar[i]}
                                            onChange={(e) => handleAadhaarChange(i, e.target.value)}
                                            required />
                                    ))}
                                </div>
                            </div>

                            {/* Show email & OTP input if Aadhaar is valid */}
                            {email && isOtpSent && !isOtpVerified && (
                                <>
                                    <h5>Verify OTP</h5>
                                    <input type="text" className="form-control mb-2" placeholder="Enter OTP" 
                                        value={otp} onChange={(e) => setOtp(e.target.value)} required />
                                    <button className="btn btn-warning w-100" onClick={verifyOtp}>Verify OTP</button>
                                </>
                            )}

                            {/* Show fetched user details after OTP verification */}
                            {isOtpVerified && fullName && (
                                <>
                                    <h5>Fetched Aadhaar Details</h5>
                                    <input type="text" className="form-control mb-2" value={fullName} disabled />
                                    <input type="email" className="form-control mb-2" value={email} disabled />
                                    <input type="text" className="form-control mb-2" value={phoneNumber} disabled />
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <h5>Enter Your Details</h5>
                            <input type="text" className="form-control mb-2" placeholder="Full Name *"
                               onChange={(e) => setFullName(e.target.value)} required />
                            <input type="email" className="form-control mb-2" placeholder="Email ID *"
                                onChange={(e) => setEmail(e.target.value)} required />
                            <input type="text" className="form-control mb-2" placeholder="Mobile Number *"
                                 onChange={(e) => setPhoneNumber(e.target.value)} required />
                        </>
                    )}

                    <h5>Create Password</h5>
                    <input type="password" className="form-control mb-3" placeholder="Password *"
                        value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <button type="button" className="btn btn-success w-100" onClick={handleSubmit} >
                        Submit
                    </button>
                    {hdmisNumber && submittedName && (
                        <div className="mt-4 text-center">
                            <h4>✅ HDMIS Number Created</h4>
                            <p><strong>Name:</strong> {submittedName}</p>
                            <p><strong>HDMIS Number:</strong> {hdmisNumber}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateHDMISNumber;
