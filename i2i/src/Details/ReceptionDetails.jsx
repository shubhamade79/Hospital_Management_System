import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./ReceptionDetails.css";

const ReceptionDetails = () => {
  const { user_id } = useParams(); // Get reception ID from URL
  const navigate = useNavigate();
  const [reception, setReception] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    console.log("Extracted user_id from URL:", user_id);  // Debugging
  
    if (!user_id) {
      setErrorMessage("Invalid receptionist ID.");
      return;
    }
  
    console.log(`Fetching: http://localhost:5000/reception/${user_id}`);
  
    axios.get(`http://localhost:5000/reception/${user_id}`)
      .then(response => {
        console.log("API Response:", response.data);
        if (!response.data || Object.keys(response.data).length === 0) {
          setErrorMessage("No receptionist found.");
        } else {
          setReception(response.data);
          setEditedData(response.data); // Initialize edited data with existing values
        }
      })
      .catch(error => {
        console.error("Error fetching reception details:", error);
        setErrorMessage("Error fetching reception details.");
      });
  }, [user_id]);

  // Handle form input changes
  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  // Submit updated details
  const handleUpdate = () => {
    axios.put(`http://localhost:5000/reception/${user_id}`, editedData)
      .then(response => {
        console.log("Update Response:", response.data);
        setReception(editedData);
        setIsEditing(false);
      })
      .catch(error => {
        console.error("Error updating reception details:", error);
        setErrorMessage("Error updating receptionist details.");
      });
  };

  return (
    <div>
      <Header />
      <div className="reception-container">
  <h2 className="reception-header">Receptionist Details</h2>
  {errorMessage && <p className="reception-error">{errorMessage}</p>}
  
  {reception ? (
    isEditing ? (
      <div className="reception-form">
        <label><strong>Name:</strong></label>
        <input type="text" name="name" value={editedData.name} onChange={handleChange} className="form-control" />
        
        <label><strong>Contact:</strong></label>
        <input type="text" name="contact" value={editedData.contact} onChange={handleChange} className="form-control" />

        <button className="reception-btn reception-btn-success mt-3" onClick={handleUpdate}>Save</button>
        <button className="reception-btn reception-btn-secondary mt-3 ms-2" onClick={() => setIsEditing(false)}>Cancel</button>
      </div>
    ) : (
      <div>
        <p><strong>ID:</strong> {reception.user_id}</p>
        <p><strong>Name:</strong> {reception.name}</p>
        <p><strong>Contact:</strong> {reception.contact}</p>
        <p><strong>Hospital Name:</strong> {reception.hospital_name}</p>
        <p><strong>Hospital Address:</strong> {reception.hospital_address}</p>

        <button className="reception-btn reception-btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
        <button className="reception-btn reception-btn-secondary ms-2" onClick={() => navigate(-1)}>Back</button>
      </div>
    )
  ) : (
    <p className="reception-loading">Loading...</p>
  )}
</div>

    </div>
  );
};

export default ReceptionDetails;
