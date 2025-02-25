import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [receptions, setReceptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const admin_id = localStorage.getItem("admin_id"); // Get the logged-in admin's ID

    if (!admin_id) {
      setErrorMessage("Admin not logged in.");
      return;
    }

    // Fetch doctors and receptionists data using admin_id
    const fetchData = async () => {
      try {
        console.log("Fetching doctors and receptionists..."); // Debugging

        const doctorResponse = await axios.get(`http://localhost:5000/doctors`, {
          params: { admin_id }, // Pass the admin_id as a query parameter
        });
        const receptionResponse = await axios.get(`http://localhost:5000/receptions`, {
          params: { admin_id }, // Pass the admin_id as a query parameter
        });

        console.log("Doctors:", doctorResponse.data); // Debugging
        console.log("Receptions:", receptionResponse.data); // Debugging

        setDoctors(doctorResponse.data);
        setReceptions(receptionResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Error fetching data.");
      }
    };

    fetchData();
  }, []);

 // Delete Doctor
const deleteDoctor = async (doctor_id) => {
  if (window.confirm("Are you sure you want to delete this doctor?")) {
    try {
      await axios.delete(`http://localhost:5000/api/delete-doctor/${doctor_id}`);
      setDoctors(doctors.filter((doctor) => doctor.doctor_id !== doctor_id));
      alert("Doctor deleted successfully!");
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor.");
    }
  }
};

// Delete Receptionist
const deleteReceptionist = async (user_id) => {
  if (window.confirm("Are you sure you want to delete this receptionist?")) {
    try {
      await axios.delete(`http://localhost:5000/api/delete-receptionist/${user_id}`);
      setReceptions(receptions.filter((reception) => reception.user_id !== user_id));
      alert("Receptionist deleted successfully!");
    } catch (error) {
      console.error("Error deleting receptionist:", error);
      alert("Failed to delete receptionist.");
    }
  }
};


  return (
    <div>
      <Header />
      <div className="">
        <h2 className="text-center mb-4">Admin Dashboard</h2>
        <div className="row">
          {/* Doctors Section */}
          <div className="col-md-6">
            <h3>Doctors Information</h3>
            <button className="btn btn-info" onClick={() => navigate('/doctor-allotment')}>
              Doctor Allotment
            </button>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.doctor_id}>
                    <td>{doctor.doctor_id}</td>
                    <td>{doctor.name}</td>
                    <td>{doctor.specialization}</td>
                    <td>
                      <button
                        className="btn btn-info"
                        onClick={() => navigate(`/doctor-details/${doctor.doctor_id}`)}
                      >
                        View Details
                      </button>
                      <button className="btn btn-danger ms-2" onClick={() => deleteDoctor(doctor.doctor_id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Receptionists Section */}
          <div className="col-md-6">
            <h3>Receptionists Information</h3>
            <button className="btn btn-info" onClick={() => navigate('/reception-allotment')}>
              Reception Allotment
            </button>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {receptions.map((reception) => (
                  <tr key={reception.user_id}>
                    <td>{reception.user_id}</td>
                    <td>{reception.name}</td>
                    <td>{reception.contact}</td>
                    <td>
                      <button
                        className="btn btn-info"
                        onClick={() => {
                          console.log("Navigating to Reception Details:", reception.user_id);
                          navigate(`/reception-details/${reception.user_id}`);
                        }}
                      >
                        View Details
                      </button>
                      <button className="btn btn-danger ms-2" onClick={() => deleteReceptionist(reception.user_id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
