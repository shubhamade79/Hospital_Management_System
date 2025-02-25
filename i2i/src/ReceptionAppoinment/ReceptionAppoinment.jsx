import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const ReceptionAppointment = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const receptionId = localStorage.getItem("reception_id");
  console.log("Reception Id : ", receptionId);

  useEffect(() => {
    if (!receptionId) {
      navigate("/hospital-login");
    } else {
      fetchAppointments();
    }
  }, [receptionId, navigate]);

  const fetchAppointments = async () => {
    try {
      const todayDate = new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD" format
      console.log("Corrected Today's Date:", todayDate);
  
      if (!receptionId) {
        console.error("No receptionId found!");
        return;
      }
  
      const response = await axios.get("http://localhost:5000/get-appointments", {
        params: { reception_id: receptionId, date: todayDate },
      });
  
      console.log("API Response:", response.data);
      
      if (!response.data || !Array.isArray(response.data.appointments)) {
        throw new Error("Invalid response format");
      }
  
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setErrorMessage("Failed to fetch appointments. Please try again later.");
    }
  };
  
  

  // Redirect to the Add Appointment Page
  const handleAddAppointment = () => {
    navigate(`/reception-dashboard/${receptionId}`);
  };

  // Filter & Sort Appointments by Time (Ascending Order)
  const filteredAppointments = appointments
    .filter((appointment) =>
      appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.hdmis_number.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const [aHours, aMinutes] = a.time.split(":").map(Number);
      const [bHours, bMinutes] = b.time.split(":").map(Number);

      return aHours !== bHours ? aHours - bHours : aMinutes - bMinutes;
    });

    // Delete Appointment
    const deleteAppointment = async (appointment_id) => {
      if (window.confirm("Are you sure you want to delete this appointment?")) {
        try {
          await axios.delete(`http://localhost:5000/delete-appointment/${appointment_id}`);
          setAppointments(appointments.filter((appointment) => appointment.appointment_id !== appointment_id));
          alert("Appointment deleted successfully!");
        } catch (error) {
          console.error("Error deleting appointment:", error);
          alert("Failed to delete appointment.");
        }
      }
    };
    

  return (
    <div>
      <Header />
      <div className="">
        <h2 className="text-center my-4">Today's Appointments</h2>
        {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

        {/* Add Appointment Button */}
        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by Patient Name or HDMIS Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn " onClick={handleAddAppointment}>
            + Add Appointment
          </button>
        </div>

        {/* Appointments Table */}
        <div className="appointment-list">
          {filteredAppointments.length === 0 ? (
            <p className="text-center">No matching appointments found.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient Name</th>
                  <th>HDMIS Number</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment, index) => (
                  <tr key={appointment.appointment_id}>
                    <td>{index + 1}</td>
                    <td>{appointment.patient_name}</td>
                    <td>{appointment.hdmis_number}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.status}</td>
                    <td>
                    <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteAppointment(appointment.appointment_id)}
                            >
                              🗑 Delete
                            </button>

                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceptionAppointment;
