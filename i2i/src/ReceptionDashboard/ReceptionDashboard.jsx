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
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
          console.error("User ID not found in localStorage.");
          return;
        }
  
        // Fetch the hospital details to get admin_id
        const hospitalResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/hospitals/${user_id}`);
        const admin_id = hospitalResponse.data?.admin_id;
  
        if (!admin_id) {
          console.error("Admin ID not found for the hospital.");
          return;
        }
  
        // Fetch doctors with matching admin_id
        const doctorsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/doctors?admin_id=${admin_id}`);
        setDoctors(doctorsResponse.data);
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/Patient_detail_for_appointment/${hdmisNumber}`);
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
      await axios.post(`${process.env.REACT_APP_API_URL}/api/Patient_detail_for_appointment`, {
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
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const handleAppointmentChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    const reception_id = localStorage.getItem("reception_id");

    if (!hdmisNumber || !appointment.doctor_id || !appointment.date || !appointment.time || !reception_id) {
        setMessage("All fields are required!");
        return;
    }

    try {
        console.log("Registering patient with:", {
            hdmis_number: hdmisNumber,
            full_name: patientData.full_name,
            age: calculateAge(patientData.date_of_birth),
            gender: patientData.gender,
            date_of_birth: patientData.date_of_birth,
            contact_number: patientData.phone_number,
            email: patientData.email,
            address: patientData.address,
        });

        await axios.post(`${process.env.REACT_APP_API_URL}/api/Patient_detail_for_appointment`, {
            hdmis_number: hdmisNumber,
            full_name: patientData.full_name || "Unknown",
            age: calculateAge(patientData.date_of_birth),
            gender: patientData.gender || "Unknown",
            date_of_birth: patientData.date_of_birth || "1900-01-01",
            contact_number: patientData.phone_number || "0000000000",
            email: patientData.email || "unknown@example.com",
            address: patientData.address || "Unknown",
        });

        console.log("Booking appointment with:", {
            hdmis_number: hdmisNumber,
            doctor_id: appointment.doctor_id,
            date: appointment.date,
            time: appointment.time,
            reception_id: reception_id,
        });

        await axios.post(`${process.env.REACT_APP_API_URL}/api/book_appointment`, {
            hdmis_number: hdmisNumber,
            doctor_id: appointment.doctor_id,
            date: appointment.date,
            time: appointment.time,
            reception_id: reception_id,
        });

        setMessage("Appointment booked successfully!");
        setAppointment({ doctor_id: "", date: "", time: "" });

    } catch (error) {
        console.error("Error Response:", error.response?.data || error.message);
        setMessage("Error registering patient or booking appointment. Try again.");
    }
};


  return (
    <div>
      <Header />
      <div className="mt-5">
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
                  <td>{calculateAge(patientData.date_of_birth)}</td>
                  <td>{patientData.gender}</td>
                  <td>{patientData.phone_number}</td>
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
      </div>
    </div>
  );
};

export default ReceptionDashboard;
