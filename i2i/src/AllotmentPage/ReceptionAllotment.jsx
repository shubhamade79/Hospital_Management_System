import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

// Function to generate a random user_id and password
const generateRandomString = () => {
    const numbers = "0123456789";
    let result = "REC"; // Fixed prefix
    for (let i = 0; i < 3; i++) {
        result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return result;
};

const ReceptionAllotment = () => {
    const navigate = useNavigate();
    const [receptionDetails, setReceptionDetails] = useState({
        user_id: generateRandomString(),  // Generate user_id once
        password: generateRandomString(), // Generate password once
        contact: "",
        name: "",
        hospital_name: "",
        email: "",  // Add email field
    });
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch hospital name based on admin_id
    useEffect(() => {
        const fetchHospitalName = async () => {
            const admin_id = localStorage.getItem("user_id");
            if (!admin_id) {
                setErrorMessage("Admin not logged in.");
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-hospital-name`, {
                    params: { admin_id },
                });
                if (response.data && response.data.hospital_name && response.data.hospital_address && response.data.hospital_city && response.data.hospital_state) {
                    setReceptionDetails((prevDetails) => ({
                        ...prevDetails,
                        hospital_name: response.data.hospital_name,
                        hospital_address: response.data.hospital_address,
                        hospital_state: response.data.hospital_state,
                        hospital_city: response.data.hospital_city,
                    }));
                } else {
                    setErrorMessage("Hospital name & Address not found.");
                }
            } catch (error) {
                setErrorMessage("Error fetching hospital name.");
            }
        };

        fetchHospitalName();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setReceptionDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { user_id, password, contact, email, name, hospital_name, hospital_address, hospital_city, hospital_state } = receptionDetails;

        if (!contact || !name || !email || !hospital_name || !hospital_address) {
            setErrorMessage("All fields are required.");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/add-receptionist`, {
                user_id,
                password,
                admin_id: localStorage.getItem("user_id"),
                contact,
                name,
                hospital_name,
                hospital_address,
                hospital_city,
                hospital_state,
                email,
            });

            if (response.data.success) {
                alert("Receptionist registered successfully! Email sent.");
                navigate("/admin-dashboard/:admin_id"); // Redirect after successful registration
            } else {
                setErrorMessage("Error registering receptionist.");
            }
        } catch (error) {
            console.error("Error details:", error);
            setErrorMessage(error.response?.data?.message || "Error connecting to the server.");
        }
    };

    return (
        <div>
            <Header />
            <div className="container d-flex justify-content-center">
                <div className="card p-4 shadow-lg" style={{ width: "40rem" }}>
                    <h2 className="text-center mb-4">Reception Allotment</h2>
                    {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                    <form onSubmit={handleSubmit}>
                        {Object.keys(receptionDetails).map((key) => (
                            <div className="form-group" key={key}>
                                <label htmlFor={key} className="font-weight-bold">{key.replace("_", " ").toUpperCase()}</label>
                                <input
                                    type={key === "email" ? "email" : "text"}
                                    className="form-control"
                                    id={key}
                                    name={key}
                                    value={receptionDetails[key]}
                                    onChange={handleChange}
                                    required={!(key === "user_id" || key === "password" || key.includes("hospital"))}
                                    disabled={key === "user_id" || key === "password" || key.includes("hospital")}
                                />
                            </div>
                        ))}
                        <button type="submit" className="btn btn-primary mt-3 w-100">
                            Register Receptionist
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReceptionAllotment;