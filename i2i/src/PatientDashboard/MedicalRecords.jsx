import React, { useEffect, useState } from "react";
import axios from "axios";

const MedicalRecords = () => {
    const [records, setRecords] = useState([]);
    const [error, setError] = useState("");
    const [patientId, setPatientId] = useState(null);

    useEffect(() => {
        // Get patient ID from localStorage
        const storedPatient = localStorage.getItem("patient");
        if (storedPatient) {
            const patientData = JSON.parse(storedPatient);
            setPatientId(patientData.patient_id);
        }
    }, []);

    useEffect(() => {
        const fetchRecords = async () => {
            if (!patientId) return;  // Ensure patient ID is available before fetching

            try {
                const response = await axios.get(`http://localhost:5000/medical-records/${patientId}`);
                setRecords(response.data);
            } catch (error) {
                setError(error.response?.data?.message || "Error fetching records");
            }
        };

        fetchRecords();
    }, [patientId]);  // Fetch records when patient ID is available

    return (
        <div className="container">
            <h2 className="mt-3">Medical Records</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {records.length > 0 ? (
                <table className="table table-bordered mt-3">
                    <thead className="thead-dark">
                        <tr>
                            <th>Doctor ID</th>
                            <th>Disease</th>
                            <th>Hospital Name</th>
                            <th>Hospital Address</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Checkup Date & Time</th>
                            <th>Prescription</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => (
                            <tr key={index}>
                                <td>{record.doctor_id}</td>
                                <td>{record.disease}</td>
                                <td>{record.hospital_name}</td>
                                <td>{record.hospital_address}</td>
                                <td>{record.hospital_city}</td>
                                <td>{record.hospital_state}</td>
                                <td>{new Date(record.created_at).toLocaleString()}</td>
                                <td>{record.filePath ? (
                                        <a 
                                            href={`http://localhost:5000${record.filePath}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="btn btn-primary btn-sm"
                                        >
                                            View Prescription
                                        </a>
                                    ) : (
                                        <span className="text-muted">No File</span>
                                    )}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No records found.</p>
            )}
        </div>
    );
};

export default MedicalRecords;
