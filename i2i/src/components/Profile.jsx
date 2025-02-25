import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MobileHeader from "../components/MobileHeader";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user details from localStorage
    const storedUser = localStorage.getItem("user_id") === id ? {
      name: localStorage.getItem("username"),
      role: localStorage.getItem("role"),
      id: localStorage.getItem("user_id"),
    } : null;

    // Check if the patient data matches the user ID
    const patientData = localStorage.getItem("patient");
    let patient = null;

    try {
      patient = patientData ? JSON.parse(patientData) : null;
    } catch (error) {
      console.error("Error parsing patient data:", error);
    }

    if (patient && patient.patient_id === id) {
      setUser({ name: patient.full_name, id: patient.patient_id, role: "Patient" });
    } else if (storedUser) {
      setUser(storedUser);
    }
  }, [id]);

  if (!user) {
    return <p className="text-center mt-5">User not found!</p>;
  }

  return (
    <div>
        <MobileHeader />
    <h2 className="text-center">User Profile</h2>
    <div className="container mt-5">
      <div className="card p-4 shadow-lg">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
    </div>
  );
};

export default Profile;
