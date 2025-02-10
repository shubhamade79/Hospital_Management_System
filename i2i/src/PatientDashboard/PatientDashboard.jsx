import React from "react";
import { useNavigate } from "react-router-dom"; // React Router for redirection
import MedicalRecords from "./MedicalRecords";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is loaded

const PatientDashboard = () => {
    const navigate = useNavigate(); // Hook for navigation

    // Get patient data from localStorage
    const patientData = localStorage.getItem("patient");
    const patient = patientData ? JSON.parse(patientData) : null;

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("patient"); // Clear patient session
        navigate("/patient-login"); // Redirect to login page
    };

    if (!patient) {
        console.log("No patient data found in localStorage");
        return <h2>Please log in to access the dashboard</h2>;
    }

    return (
        <div>
            {/* ✅ Navbar with Username and Patient ID */}
            <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
                <Navbar.Brand className="text-black" href="/">Hospital Management</Navbar.Brand>
                <Nav className="ms-auto d-flex align-items-center">
                    <span className="me-3 text-black">
                        Welcome, {patient.full_name} (ID: {patient.patient_id})
                    </span>
                    <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                        Logout
                    </button>
                </Nav>
            </Navbar>

            {/* ✅ Patient Dashboard Content */}
            <div className="container mt-4 text-black">
                <MedicalRecords hdmisNumber={patient.hdmis_number} />
            </div>
        </div>
    );
};

export default PatientDashboard;
