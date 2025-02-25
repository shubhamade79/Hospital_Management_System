import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import MobileHeader from "../components/MobileHeader";
import Header from "../components/Header";

const ReceptionDashboard = () => {
  const [hdmisNumber, setHdmisNumber] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);
  const [newPatient, setNewPatient] = useState({});
  const [message, setMessage] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [appointment, setAppointment] = useState({ doctor_id: "", date: "", time: "" });

  // Fetch doctors when component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/doctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  // Handle Search when Enter is pressed
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!hdmisNumber.trim()) {
      setErrorMessage("Please enter an HDMIS Number.");
      return;
    }
    setErrorMessage("");
    setPatientData(null);
    setShowRegistration(false);

    try {
      const response = await axios.get(`http://localhost:5000/api/Patient_detail_for_appointment/${hdmisNumber}`);
      if (response.data) {
        setPatientData(response.data);
      } else {
        setErrorMessage("Patient not found. Please register below.");
        setShowRegistration(true);
      }
    } catch (error) {
      setErrorMessage("Patient not found. Please register below.");
      setShowRegistration(true);
    }
  };

  const handleChange = (e) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/Patient_detail_for_appointment", {
        hdmis_number: hdmisNumber,
        ...newPatient,
      });
      setMessage("Patient registered successfully!");
      setShowRegistration(false);
      setNewPatient({});
      setHdmisNumber("");
    } catch (error) {
      setMessage("Error registering patient. Try again.");
    }
  };

  const handleAppointmentChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    // Retrieve reception_id from localStorage
    const reception_id = localStorage.getItem("reception_id");

    if (!hdmisNumber || !appointment.doctor_id || !appointment.date || !appointment.time || !reception_id) {
        setMessage("All fields are required!");
        return;
    }

    try {
        const response = await axios.post("http://localhost:5000/api/book_appointment", {
            hdmis_number: hdmisNumber, // ✅ Ensure this is correct
            doctor_id: appointment.doctor_id,
            date: appointment.date,
            time: appointment.time,
            reception_id: reception_id, // Include reception_id from localStorage
        });

        setMessage("Appointment booked successfully!");
        setAppointment({ doctor_id: "", date: "", time: "" });
    } catch (error) {
        console.error("Error booking appointment:", error);
        setMessage("Error booking appointment. Try again.");
    }
};


  return (
    <div>
      <Header />
      <div className=" mt-5">
        <h2 className="text-center">Reception | Search & Register Patient</h2>
        {message && <p className="text-success text-center mt-3">{message}</p>}

        <div className="form-group">
          <label>Enter HDMIS Number:</label>
          <input
            type="text"
            className="form-control"
            value={hdmisNumber}
            onChange={(e) => setHdmisNumber(e.target.value)}
            onKeyDown={handleKeyDown}  // Listen for Enter key
            required
          />
          <button className="btn  mt-2 text-center" onClick={handleSearch}>
            Search Patient
          </button>
        </div>

        {errorMessage && <p className="text-danger text-center mt-3">{errorMessage}</p>}

        {patientData && (
          <div className="mt-4">
            <h3 className="text-success text-center">Patient Found</h3>
            <table className="table table-bordered mt-3">
              <thead className="table-dark">
                <tr>
                  <th>Full Name</th>
                  <th>HDMIS Number</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{patientData.full_name}</td>
                  <td>{patientData.hdmis_number}</td>
                  <td>{patientData.age}</td>
                  <td>{patientData.gender}</td>
                  <td>{patientData.contact_number}</td>
                  <td>{patientData.email || "N/A"}</td>
                  <td>{patientData.address || "N/A"}</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-center mt-4">Book Appointment</h3>
            <form onSubmit={handleBookAppointment}>
              <div className="form-group">
                <label>Select Doctor:</label>
                <select className="form-control" name="doctor_id" required onChange={handleAppointmentChange}>
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.doctor_id} value={doctor.doctor_id}>
                    {doctor.doctor_id} - {doctor.name} ({doctor.specialization})
                  </option>
                ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date:</label>
                <input type="date" className="form-control" name="date" required onChange={handleAppointmentChange} />
              </div>
              <div className="form-group">
                <label>Time:</label>
                <input type="time" className="form-control" name="time" required onChange={handleAppointmentChange} />
              </div>
              <button type="submit" className="btn btn-success mt-2 w-100">Book Appointment</button>
            </form>
          </div>
        )}

        {showRegistration && (
          <div className="register-form mt-3">
            <h3 className="text-center">New Patient Registration</h3>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Age:</label>
                <input type="number" className="form-control" name="age" required onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Gender:</label>
                <select className="form-control" name="gender" required onChange={handleChange}>
                  <option value="Select">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {/* <div className="form-group">
                <label>Contact Number:</label>
                <input type="text" className="form-control" name="contact_number" required onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" className="form-control" name="email" required onChange={handleChange} />
              </div> */}
              <div className="form-group">
                <label>Address:</label>
                <textarea className="form-control" name="address" required onChange={handleChange}></textarea>
              </div>
              <button type="submit" className="btn btn-success mt-2 w-100">Register Patient</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceptionDashboard;
