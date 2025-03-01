import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsPencilSquare } from "react-icons/bs"; // Correct import
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import PatientNavbar from "../components/patientnavbar";

const PatientProfile = () => {
  const { hdmisId } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/patients/${hdmisId}`
        );
        setPatient(response.data);
      } catch (err) {
        setError("Patient not found");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [hdmisId]);

  const handleUpdate = async (field, value) => {
    const updatedValue = value.trim() === "" ? "None" : value; // Set "None" if input is cleared

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/patients/${hdmisId}`, {
        [field]: updatedValue,
      });

      setPatient((prev) => ({ ...prev, [field]: updatedValue }));
    } catch (error) {
      alert(`Failed to update ${field}`);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error)
    return <div className="alert alert-danger text-center mt-5">{error}</div>;

  return (
    <div>
      <PatientNavbar />
      <div className="container mt-4">
        <div className="card shadow p-3">
          <h2 className="text-center">Patient Profile</h2>
          <hr />
          <div className="row">
            <div className="col-md-8">
              <h4>
                {patient.full_name || "N/A"} ({patient.gender || "N/A"})
              </h4>
              <p>
                <strong>HDMIS ID:</strong> {patient.hdmis_number || "N/A"}
              </p>
              <p>
                <strong>DOB:</strong>{" "}
                {patient.date_of_birth
                  ? new Date(patient.date_of_birth).toLocaleDateString()
                  : "N/A"}
                (
                {patient.date_of_birth
                  ? new Date().getFullYear() -
                    new Date(patient.date_of_birth).getFullYear() +
                    " years"
                  : "N/A"}
                )
              </p>

              {/* Blood Group with Edit Icon */}
              <p>
                <strong>Blood Group:</strong>
                <select
                  value={
                    patient.blood_group === "None"
                      ? ""
                      : patient.blood_group || ""
                  }
                  onChange={(e) => handleUpdate("blood_group", e.target.value)}
                  className="form-control d-inline w-25 mx-2"
                  disabled={!isEditable} // Enable only in edit mode
                >
                  <option value="">Select</option>
                  <option value="None">None</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                <button
                  className="btn btn-light ml-2"
                  onClick={() => setIsEditable(!isEditable)}
                >
                  <BsPencilSquare /> {/* Edit icon */}
                </button>
              </p>

              <p>
                <strong>Phone:</strong> {patient.phone_number || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {patient.email || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {patient.address || "N/A"},{" "}
                {patient.city || "N/A"}, {patient.state || "N/A"},{" "}
                {patient.pin_code || "N/A"}
              </p>
              <p>
                <strong>Handicapped:</strong>
                <select
                  value={patient.handicapped || ""}
                  onChange={(e) => handleUpdate("handicapped", e.target.value)}
                  className="form-control d-inline w-25 mx-2"
                  disabled={!isEditable} // Enable only in edit mode
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <button
                  className="btn btn-light ml-2"
                  onClick={() => setIsEditable(!isEditable)}
                >
                  <BsPencilSquare /> {/* Edit icon */}
                </button>
              </p>
              <p>
                <strong>Income Range:</strong>
                <select
                  value={patient.income_range || ""}
                  onChange={(e) => handleUpdate("income_range", e.target.value)}
                  className="form-control d-inline w-25 mx-2"
                  disabled={!isEditable} // Enable only in edit mode
                >
                  <option value="">Select</option>
                  <option value="Below 1 Lakh">Below 1 Lakh</option>
                  <option value="1-5 Lakhs">1-5 Lakhs</option>
                  <option value="5-10 Lakhs">5-10 Lakhs</option>
                  <option value="Above 10 Lakhs">Above 10 Lakhs</option>
                </select>
                <button
                  className="btn btn-light ml-2"
                  onClick={() => setIsEditable(!isEditable)}
                >
                  <BsPencilSquare /> {/* Edit icon */}
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="card shadow p-3 mt-3">
          <h4>Medical Information</h4>
          <p>
            <strong>Allergies:</strong>
            <input
              type="text"
              value={patient.allergies || ""}
              onChange={(e) => handleUpdate("allergies", e.target.value)}
              className="form-control mt-2"
            />
          </p>
          <p>
            <strong>Pre-existing Conditions:</strong>
            <input
              type="text"
              value={patient.pre_existing_conditions || ""}
              onChange={(e) =>
                handleUpdate("pre_existing_conditions", e.target.value)
              }
              className="form-control mt-2"
            />
          </p>
          <p>
            <strong>Ongoing Medications:</strong>
            <input
              type="text"
              value={patient.medications || ""}
              onChange={(e) => handleUpdate("medications", e.target.value)}
              className="form-control mt-2"
            />
          </p>
        </div>

        <div className="card shadow p-3 mt-3">
          <h4>Hospital & Doctor Details</h4>
          <p>
            <strong>Hospital:</strong>
            <input
              type="text"
              value={patient.hospital || ""}
              onChange={(e) => handleUpdate("hospital", e.target.value)}
              className="form-control mt-2"
            />
          </p>
          <p>
            <strong>Assigned Doctor:</strong>
            <input
              type="text"
              value={patient.doctor || ""}
              onChange={(e) => handleUpdate("doctor", e.target.value)}
              className="form-control mt-2"
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
