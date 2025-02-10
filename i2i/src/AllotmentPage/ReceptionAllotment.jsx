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
                const response = await axios.get("http://localhost:5000/get-hospital-name", {
                    params: { admin_id },
                });
                if (response.data && response.data.hospital_name && response.data.hospital_address) {
                    setReceptionDetails((prevDetails) => ({
                        ...prevDetails,
                        hospital_name: response.data.hospital_name,
                        hospital_address:response.data.hospital_address,
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
        const { user_id, password, contact,email, name, hospital_name,hospital_address } = receptionDetails;

        if (!contact || !name ||!email || !hospital_name || !hospital_address) {
            setErrorMessage("All fields are required.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/add-receptionist", {
                user_id,
                password,
                admin_id: localStorage.getItem("user_id"),
                contact,
                name,
                hospital_name,
                hospital_address,
                email,  // Add email field

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
            <div className="container">
                <h2 className="text-center mb-4">Reception Allotment</h2>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="user_id">User ID</label>
                        <input
                            type="text"
                            className="form-control"
                            id="user_id"
                            name="user_id"
                            value={receptionDetails.user_id}
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="text"
                            className="form-control"
                            id="password"
                            name="password"
                            value={receptionDetails.password}
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact">Contact</label>
                        <input
                            type="text"
                            className="form-control"
                            id="contact"
                            name="contact"
                            value={receptionDetails.contact}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={receptionDetails.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Receptionist's Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={receptionDetails.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="hospital_name">Hospital Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="hospital_name"
                            name="hospital_name"
                            value={receptionDetails.hospital_name}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="hospital_name">Hospital Address</label>
                        <input
                            type="text"
                            className="form-control"
                            id="hospital_address"
                            name="hospital_address"
                            required
                            value={receptionDetails.hospital_address}
                            disabled
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">
                        Register Receptionist
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReceptionAllotment;
