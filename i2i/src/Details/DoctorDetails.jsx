import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./DoctorDetails.css";

const DoctorDetails = () => {
  const { doctor_id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDoctor, setEditedDoctor] = useState({});

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/doctor/${doctor_id}`);
        if (response.data) {
          setDoctor(response.data);
          setEditedDoctor(response.data);
        } else {
          setErrorMessage("Doctor not found.");
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        setErrorMessage("Error fetching doctor details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctor_id]);

  // Handle input changes
  const handleChange = (e) => {
    setEditedDoctor({ ...editedDoctor, [e.target.name]: e.target.value });
  };

  // Submit the updated details
  const handleUpdate = () => {
    axios.put(`${process.env.REACT_APP_API_URL}/doctor/${doctor_id}`, editedDoctor)
      .then(response => {
        console.log("Update Response:", response.data);
        setDoctor(editedDoctor);
        setIsEditing(false);
      })
      .catch(error => {
        console.error("Error updating doctor details:", error);
        setErrorMessage("Error updating doctor details.");
      });
  };

  return (
    <div className="doctor-container">
  <h2 className="doctor-header">Doctor Details</h2>
  {loading ? (
    <p className="doctor-loading">Loading...</p>
  ) : errorMessage ? (
    <p className="doctor-error">{errorMessage}</p>
  ) : (
    <div>
      {isEditing ? (
        <div className="doctor-form">
          <label><strong>Name:</strong></label>
          <input type="text" name="name" value={editedDoctor.full_name} onChange={handleChange} className="form-control" />

          <label><strong>Specialization:</strong></label>
          <input type="text" name="specialization" value={editedDoctor.specialization} onChange={handleChange} className="form-control" />

          <label><strong>Contact Number:</strong></label>
          <input   type="text"   name="contact_number"   value={editedDoctor.phone}   onChange={handleChange}   className="form-control" />

          <label><strong>Email:</strong></label>
          <input type="email" name="email" value={editedDoctor.email} onChange={handleChange} className="form-control" />


          <button className="doctor-btn doctor-btn-success mt-3" onClick={handleUpdate}>Save</button>
          <button className="doctor-btn doctor-btn-secondary mt-3 ms-2" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p><strong>ID:</strong> {doctor.doctor_id}</p>
          <p><strong>Name:</strong> {doctor.full_name}</p>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
          <p><strong>Contact Number:</strong> {doctor.phone}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Hospital Name :</strong> {doctor.hospital_name}</p>
          <p><strong>Hospital Address:</strong> {doctor.hospital_address}</p>


          <button className="doctor-btn doctor-btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
          <button className="doctor-btn doctor-btn-secondary ms-2" onClick={() => navigate(-1)}>Back</button>
        </div>
      )}
    </div>
  )}
</div>

  );
};

export default DoctorDetails;
