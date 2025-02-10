import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HDMISHomePage from "./Home/HDMISHomePage";
import HospitalLogin from "./HospitalLogin/HospitalLogin";
import PatientLogin from "./PatientLogin/PatientLogin";
import CreateHDMISNumber from "./CreateHDMISNumber/CreateHDMISNumber";
import RegistrationForm from "./RegistrationForm/RegistrationForm";
import ReceptionDashboard from "./ReceptionDashboard/ReceptionDashboard";
import About from "./Home/About";
import DoctorDashboard from "./DoctorDashboard/DoctorDashboard";
import DoctorPrescription from "./DoctorPrescription/DoctorPrescription";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import DoctorAllotment from "./AllotmentPage/DoctorAllotment";
import ReceptionAllotment from "./AllotmentPage/ReceptionAllotment";
import ReceptionDetails from "./Details/ReceptionDetails";
import DoctorDetails from "./Details/DoctorDetails";
import ReceptionAppointment from "./ReceptionAppoinment/ReceptionAppoinment";
import PatientDashboard from "./PatientDashboard/PatientDashboard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HDMISHomePage />} />
        <Route path="/hospital-login" element={<HospitalLogin />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/create-hdmish-number" element={<CreateHDMISNumber />} />
        <Route path="/registration" element={<RegistrationForm />} />
        <Route path="/reception-appoinment/:reception_id" element={<ReceptionAppointment />} />
        <Route path="/reception-dashboard/:reception_id" element={<ReceptionDashboard />} />
        <Route path="/doctor-dashboard/:doctor_id" element={<DoctorDashboard />} />
        <Route path="/admin-dashboard/:admin_id" element={<AdminDashboard />} />        
        <Route path="/doctor-prescription/:doctor_id/:hdmisNumber" element={<DoctorPrescription />} />
        <Route path="/reception-allotment" element={<ReceptionAllotment />} />
        <Route path="/doctor-allotment" element={<DoctorAllotment />} />
        <Route path="/doctor-details/:doctor_id" element={<DoctorDetails />} />
        <Route path="/reception-details/:user_id" element={<ReceptionDetails />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />




        <Route path="/About" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
