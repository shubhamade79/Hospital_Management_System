import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";

const DoctorPrescription = () => {
  const { doctor_id, hdmisNumber } = useParams();
  const [userData, setUserData] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [disease, setDisease] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", advice: "" }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!hdmisNumber || !doctor_id) {
      setError("Invalid patient or doctor ID");
      setLoading(false);
      return;
    }

    axios.get(`${process.env.REACT_APP_API_URL}/getPatientDetails/${hdmisNumber}`)
      .then((response) => setUserData(response.data))
      .catch(() => setError("Failed to load user details."));

    axios.get(`${process.env.REACT_APP_API_URL}/getDoctorDetails/${doctor_id}`)
      .then((response) => setDoctorData(response.data))
      .catch(() => setError("Failed to load doctor details."))
      .finally(() => setLoading(false));
  }, [hdmisNumber, doctor_id]);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", advice: "" }]);
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!disease) {
      alert("Please enter a disease.");
      return;
    }
  
    try {
      // Generate the PDF
      const doc = generatePDF();
      const pdfBlob = doc.output("blob");
      console.log("User Data:", userData);
      console.log("HDMIS Number:", userData?.hdmis_number);

      const fileName = `Prescription_${userData.hdmis_number}.pdf`;

      // Convert to FormData for file upload
      const formData = new FormData();
      formData.append("pdf", pdfBlob,fileName);
      formData.append("hdmis_number", hdmisNumber);
      formData.append("doctor_id", doctor_id);
      formData.append("disease", disease);
      formData.append("hospital_state", doctorData?.hospital_state);
      formData.append("hospital_city", doctorData?.hospital_city);
      formData.append("hospital_name", doctorData?.hospital_name);
      formData.append("hospital_address", doctorData?.hospital_address);
  
      // Upload PDF to the backend
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/uploadPrescription`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const filePath = response.data.filePath; // Assuming backend returns the file path
  
      // Save medical record with filePath in MongoDB
      await axios.post(`${process.env.REACT_APP_API_URL}/updatePatientRecord`, {
        hdmis_number: hdmisNumber,
        disease,
        doctor_id,
        hospital_state: doctorData?.hospital_state,
        hospital_city: doctorData?.hospital_city,
        hospital_name: doctorData?.hospital_name,
        hospital_address: doctorData?.hospital_address,
        filePath :filePath, // Store file path
      });
  
      // Delete appointment
      await axios.delete(`${process.env.REACT_APP_API_URL}/deleteAppointment/${hdmisNumber}/${doctor_id}`);
  
      alert("Record updated successfully, PDF stored, and appointment deleted.");
      navigate(`/doctor-dashboard/${doctor_id}`);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };
  

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.text(`${doctorData?.hospital_name}`, 60, 15);
    doc.setFontSize(10);
    doc.text(`${doctorData?.hospital_address},${doctorData?.hospital_city},${doctorData?.hospital_state}`, 80, 22);
    doc.text("Phone: +91 98765 43210", 85, 27);
    doc.text("Email: info@snshospital.com", 80, 32);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 15);
    doc.line(10, 35, 200, 35);

    // Patient Details
    doc.setFontSize(12);
    doc.text("Patient Details", 10, 42);
    doc.setFontSize(10);
    doc.text(`Name: ${userData?.full_name || "N/A"}`, 10, 50);
    doc.text(`Age: ${userData?.age || "N/A"} | Gender: ${userData?.gender || "N/A"}`, 10, 55);
    doc.text(`HDMIS No: ${userData?.hdmis_number || "N/A"}`, 150, 50);
    doc.line(10, 60, 200, 60);

    // Disease
    doc.setFontSize(12);
    doc.text("Clinical Complaints", 10, 68);
    doc.setFontSize(10);
    doc.text(`Disease: ${disease || "N/A"}`, 15, 75);
    doc.line(10, 85, 200, 85);

    // Medicine Table
    doc.setFontSize(12);
    doc.text("Prescribed Medication", 10, 93);
    const tableBody = medicines.map((med) => [med.name || "N/A", med.dosage || "N/A", med.advice || "N/A"]);

    doc.autoTable({
      startY: 100,
      head: [["Medicine", "Dosage", "Advice"]],
      body: tableBody,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
    });

    // Doctor Details
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text("Doctor Details", 10, finalY);
    doc.setFontSize(10);
    doc.text(`Name: ${doctorData?.name || "N/A"}`, 10, finalY + 7);
    doc.text(`Specialization: ${doctorData?.specialization || "N/A"}`, 10, finalY + 12);
    doc.text("Doctor's Signature: ___________", 140, finalY + 20);

    return doc;
  };
  const handleViewPDF = () => {
    const doc = generatePDF();
    window.open(doc.output("bloburl"), "_blank");
  };

  const handleDownloadPDF = () => {
    const doc = generatePDF();
    doc.save(`Prescription_${userData.hdmis_number}.pdf`);
  };
  return (
    <div>
      <Header />
      <div className=" mt-4">
        <h2 className="text-center mb-4">Doctor's Prescription</h2>
        {loading ? (
          <p className="text-center">Loading user details...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : userData ? (
          <>
            <div className="mb-3">
              <label className="form-label">Disease</label>
              <input type="text" className="form-control" value={disease} onChange={(e) => setDisease(e.target.value)} required />
            </div>

            {medicines.map((med, index) => (
              <div key={index} className="mb-3">
                <label className="form-label">Medicine {index + 1}</label>
                <input type="text" className="form-control mb-2" placeholder="Medicine Name" value={med.name} onChange={(e) => handleMedicineChange(index, "name", e.target.value)} required />
                <input type="text" className="form-control mb-2" placeholder="Dosage" value={med.dosage} onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)} required />
                <textarea className="form-control" placeholder="Advice" rows="2" value={med.advice} onChange={(e) => handleMedicineChange(index, "advice", e.target.value)} required />
              </div>
            ))}
            
            <button className="btn btn-success mb-3" onClick={handleAddMedicine}>+ Add Another Medicine</button>
            
            <div className="text-center">
            <button className="btn btn-secondary me-2" onClick={handleViewPDF}>View as PDF</button>
              <button className="btn btn-secondary me-2" onClick={handleDownloadPDF}>Download as PDF</button>
              <button className="" onClick={handleSubmit}>Save</button>
            </div>
          </>
        ) : (
          <p className="text-center">No user data found.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorPrescription;
