import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import MobileHeader from "../components/MobileHeader";

const CreateHDMISNumber = () => {
    const [aadhaar, setAadhaar] = useState(["", "", ""]);
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [hdmisNumber, setHdmisNumber] = useState("");
    const [submittedName, setSubmittedName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [useAadhaar, setUseAadhaar] = useState(true); // ✅ Toggle for Aadhaar vs. Manual Entry

    const sendHdmisEmail = async (hdmisNumber) => {
        try {
            await axios.post("http://localhost:5000/sendHdmisEmail", {
                email: email, // User's email
                hdmis_number: hdmisNumber,
            });
            alert("HDMIS ID sent successfully via Email!");
        } catch (error) {
            console.error("Error sending HDMIS email:", error);
            alert("Failed to send HDMIS ID.");
        }
    };

    // Function to generate HDMIS number (fixed prefix + random digits)
    const generateHDMISNumber = () => {
        const prefix = "HDMIS100"; // Fixed prefix
        const randomDigits = Math.floor(100 + Math.random() * 900); // Generates a 3-digit number
        return prefix + randomDigits;
    };

    const fetchFullName = async (aadhaar_number) => {
        try {
            const response = await axios.post("http://localhost:5000/getAadhaarDetails", { aadhaar_number });

            if (response.data.full_name) {
                setFullName(response.data.full_name);
                setEmail(response.data.email);
                setPhoneNumber(response.data.phone_number);
            } else {
                alert("Aadhaar number not found");
            }
        } catch (error) {
            if (error.response) {
                // Backend error message
                alert(error.response.data.message);
            } else {
                console.error("Error fetching Aadhaar details:", error);
                alert("Failed to fetch Aadhaar details.");
            }
        }
    };

    const handleSubmit = async () => {
        if (useAadhaar) {
            // Aadhaar-based submission
            const aadhaar_number = aadhaar.join("");
            if (aadhaar_number.length !== 12 || fullName === "" || password === "") {
                alert("Please fill all fields correctly");
                return;
            }
            try {
                const response = await axios.post("http://localhost:5000/storeAadhaar", {
                    aadhaar_number,
                    full_name: fullName,
                    password
                });
    
                if (response.data.hdmis_number) {
                    setHdmisNumber(response.data.hdmis_number);
                    setSubmittedName(fullName);
                    sendHdmisEmail(response.data.hdmis_number);
                } else {
                    alert("Failed to generate HDMIS number");
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                alert("Failed to store user data");
                
            }
        } else {
            // Manual submission (without Aadhaar)
            if (!fullName || !email || !phoneNumber || !password) {
                alert("Please fill all fields correctly");
                return;
            }
            try {
                const response = await axios.post("http://localhost:5000/storeManualUser", {
                    full_name: fullName,
                    email,
                    phone_number: phoneNumber,
                    password
                });
    
                if (response.data.hdmis_number) {
                    setHdmisNumber(response.data.hdmis_number);
                    setSubmittedName(fullName);
                    sendHdmisEmail(response.data.hdmis_number);
                } else {
                    alert("Failed to generate HDMIS number");
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                alert("Failed to store user data");
            }
        }
    };
    

    // Handle changes to Aadhaar number inputs
    const handleAadhaarChange = (i, value) => {
        const newAadhaar = [...aadhaar];
        newAadhaar[i] = value;
        setAadhaar(newAadhaar);

        if (newAadhaar.join("").length === 12) {
            fetchFullName(newAadhaar.join(""));
        }
    };

    return (
        <div>
            <MobileHeader />
            <div className="container mt-4">
                <h2 className="text-center mb-4">Create HDMIS Number</h2>

                {/* ✅ Toggle Aadhaar or Manual Entry */}
                <div className="text-center mb-3">
                    <button
                        className={`btn ${useAadhaar ? "btn-primary" : "btn-secondary"} me-2`}
                        onClick={() => setUseAadhaar(true)}
                    >
                        Use Aadhaar
                    </button>
                    <button
                        className={`btn ${!useAadhaar ? "btn-primary" : "btn-secondary"}`}
                        onClick={() => setUseAadhaar(false)}
                    >
                        Without Aadhaar
                    </button>
                </div>

                {useAadhaar ? (
                    <>
                        {/* ✅ Aadhaar Form */}
                        <h4>Enter Aadhaar Number</h4>
                        <div className="mb-3">
                            <label className="form-label">Aadhaar Number *</label>
                            <div className="input-group">
                                {aadhaar.map((num, i) => (
                                    <input key={i} type="text" maxLength="4" className="form-control"
                                        placeholder="0000"
                                        value={aadhaar[i]}
                                        onChange={(e) => handleAadhaarChange(i, e.target.value)}
                                        required />
                                ))}
                            </div>
                        </div>

                        <h4>Fetched Aadhaar Details</h4>
                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-control" value={fullName} disabled />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email ID</label>
                            <input type="email" className="form-control" value={email} disabled />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Mobile Number</label>
                            <input type="text" className="form-control" value={phoneNumber} disabled />
                        </div>
                    </>
                ) : (
                    <>
                        {/* ✅ Manual Entry Form */}
                        <h4>Enter Your Details</h4>
                        <div className="mb-3">
                            <label className="form-label">Full Name *</label>
                            <input type="text" className="form-control"
                                value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email ID *</label>
                            <input type="email" className="form-control"
                                value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Mobile Number *</label>
                            <input type="text" className="form-control"
                                value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                        </div>
                    </>
                )}

                {/* ✅ Password Field & Submit Button */}
                <h4>Create Password</h4>
                <div className="mb-3">
                    <label className="form-label">Password *</label>
                    <input type="password" className="form-control" required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="button" className="btn btn-success" onClick={handleSubmit}>Submit</button>

                {/* ✅ Show HDMIS Number After Submission */}
                {hdmisNumber && submittedName && (
                    <div className="mt-4">
                        <h4>HDMIS Number Created</h4>
                        <p><strong>Full Name:</strong> {submittedName}</p>
                        <p><strong>HDMIS Number:</strong> {hdmisNumber}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateHDMISNumber;
