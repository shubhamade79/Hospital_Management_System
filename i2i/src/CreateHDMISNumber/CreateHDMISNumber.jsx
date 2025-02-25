import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import MobileHeader from "../components/MobileHeader";
import "./style1.css"

const CreateHDMISNumber = () => {
    const [aadhaar, setAadhaar] = useState(["", "", ""]);
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [hdmisNumber, setHdmisNumber] = useState("");
    const [submittedName, setSubmittedName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [useAadhaar, setUseAadhaar] = useState(true);

    const sendHdmisEmail = async (hdmisNumber) => {
        try {
            await axios.post("http://localhost:5000/sendHdmisEmail", { email, hdmis_number: hdmisNumber });
            alert("HDMIS ID sent successfully via Email!");
        } catch (error) {
            alert("Failed to send HDMIS ID.");
        }
    };

    const fetchFullName = async (aadhaar_number) => {
        try {
            const response = await axios.post("http://localhost:5000/getAadhaarDetails", { aadhaar_number });
    
            if (response.data.message === "Aadhaar number already exists in the users table") {
                alert("❌ This Aadhaar number is already registered! Please log in.");
                return;  // Stop execution if duplicate is found
            }
    
            if (response.data.full_name) {
                setFullName(response.data.full_name);
                setEmail(response.data.email);
                setPhoneNumber(response.data.phone_number);
            } else {
                alert("Aadhaar number not found");
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert("❌ This Aadhaar number is already registered! Please log in.");
            } else {
                alert("Failed to fetch Aadhaar details.");
            }
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
                const response = await axios.post("http://localhost:5000/storeAadhaar", {
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
                const response = await axios.post("http://localhost:5000/storeManualUser", {
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

                            <h5>Fetched Aadhaar Details</h5>
                            <input type="text" className="form-control mb-2" value={fullName} disabled />
                            <input type="email" className="form-control mb-2" value={email} disabled />
                            <input type="text" className="form-control mb-2" value={phoneNumber} disabled />
                        </>
                    ) : (
                        <>
                            <h5>Enter Your Details</h5>
                            <input type="text" className="form-control mb-2" placeholder="Full Name *"
                                value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                            <input type="email" className="form-control mb-2" placeholder="Email ID *"
                                value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <input type="text" className="form-control mb-2" placeholder="Mobile Number *"
                                value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                        </>
                    )}

                    <h5>Create Password</h5>
                    <input type="password" className="form-control mb-3" placeholder="Password *"
                        value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <button type="button" className="btn btn-success w-100" onClick={handleSubmit}>Submit</button>

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
