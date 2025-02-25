import React from "react";
import { useNavigate } from "react-router-dom"; // React Router for redirection
import MedicalRecords from "./MedicalRecords";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is loaded
import Header from "../components/Header";
import PatientNavbar from "../components/patientnavbar";

const PatientDashboard = () => {
    const navigate = useNavigate(); // Hook for navigation

    // Get patient data from localStorage
    const patientData = localStorage.getItem("patient");
    const patient = patientData ? JSON.parse(patientData) : null;

   

    if (!patient) {
        console.log("No patient data found in localStorage");
        return <h2>Please log in to access the dashboard</h2>;
    }

    return (
        <div>
            {/* ✅ Navbar */}
            <PatientNavbar />

            {/* ✅ Patient Dashboard Content */}
            <div className=" mt-4 text-black">
                <MedicalRecords hdmisNumber={patient.hdmis_number} />
            </div>
        </div>
    );
};

export default PatientDashboard;
