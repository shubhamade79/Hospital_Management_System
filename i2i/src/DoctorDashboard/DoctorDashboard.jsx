import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const doctorId = localStorage.getItem("doctor_id");

    if (!doctorId) {
      setError("Doctor ID is missing. Please log in again.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/doctorAppointments?doctor_id=${doctorId}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const todayDate = new Date().toISOString().split("T")[0];

          const todayAppointments = response.data.filter((appointment) => {
            let appointmentDate = appointment.date;

            if (typeof appointmentDate === "string") {
              appointmentDate = appointmentDate.split("T")[0];
            } else if (typeof appointmentDate === "number") {
              appointmentDate = new Date(appointmentDate)
                .toISOString()
                .split("T")[0];
            }

            return appointmentDate === todayDate;
          });

          if (todayAppointments.length > 0) {
            setAppointments(todayAppointments);
            setFilteredAppointments(todayAppointments);
          } else {
            setError("No appointments found for today.");
          }
        } else {
          setError("No appointments found.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setError(
          error.response?.data?.message || "Failed to load appointments."
        );
        setLoading(false);
      });
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter(
        (appointment) =>
          appointment.hdmis_number.toLowerCase().includes(query) ||
          (appointment.patient_info?.full_name &&
            appointment.patient_info.full_name.toLowerCase().includes(query))
      );
      setFilteredAppointments(filtered);
    }
  };

  const handlePatientClick = (hdmisNumber) => {
    const doctorId = localStorage.getItem("doctor_id");
    if (!doctorId) {
      setError("Doctor ID is missing. Please log in again.");
      return;
    }
    navigate(`/doctor-prescription/${doctorId}/${hdmisNumber}`);
  };

  return (
    <div>
      <Header />
      <div className="mt-4">
        <h2 className="text-center mb-4">Doctor Dashboard</h2>

        {loading ? (
          <p className="text-center">Loading appointments...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : (
          <>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by HDMIS Number or Full Name..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Patient HDMIS No</th>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments
                    .sort((a, b) => {
                      const [aHours, aMinutes] = a.time.split(":").map(Number);
                      const [bHours, bMinutes] = b.time.split(":").map(Number);
                      return aHours !== bHours ? aHours - bHours : aMinutes - bMinutes;
                    })
                    .map((appointment, index) => (
                      <tr key={appointment.appointment_id}>
                        <td>{index + 1}</td>
                        <td>
                          <button
                            className="btn btn-link p-0"
                            onClick={() => handlePatientClick(appointment.hdmis_number)}
                          >
                            {appointment.hdmis_number}
                          </button>
                        </td>
                        <td>{appointment.patient_info?.full_name || "N/A"}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No matching appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
