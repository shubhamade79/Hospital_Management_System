// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Header from "../components/Header";

// const DoctorPrescription = () => {
//   const { doctor_id, hdmisNumber } = useParams(); // Get doctor_id and hdmisNumber from URL
//   const navigate = useNavigate(); // For navigation
//   const [userData, setUserData] = useState(null);
//   const [doctorData, setDoctorData] = useState(null);
//   const [medicine, setMedicine] = useState("");
//   const [disease, setDisease] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!hdmisNumber || !doctor_id) {
//       setError("Invalid patient or doctor ID");
//       setLoading(false);
//       return;
//     }

//     // Fetch patient details
//     axios
//       .get(`http://localhost:5000/getPatientDetails/${hdmisNumber}`)
//       .then((response) => {
//         console.log("Patient Data:", response.data);
//         if (response.data) {
//           setUserData(response.data);
//         } else {
//           setError("No patient details found.");
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching patient details:", error);
//         setError(error.response?.data?.message || "Failed to load user details.");
//       });

//     // Fetch doctor details using doctor_id from the URL
//     axios
//       .get(`http://localhost:5000/getDoctorDetails/${doctor_id}`)
//       .then((response) => {
//         console.log("Doctor Details:", response.data);
//         if (response.data) {
//           setDoctorData(response.data);
//         } else {
//           console.warn("No doctor details found.");
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching doctor details:", error);
//       })
//       .finally(() => setLoading(false));
//   }, [hdmisNumber, doctor_id]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!disease || !medicine) {
//       alert("Please fill in all fields.");
//       return;
//     }
  
//     try {
//       // First, update the patient record
//       const updateResponse = await axios.post("http://localhost:5000/updatePatientRecord", {
//         hdmis_number: hdmisNumber,
//         medicine,
//         disease,
//         doctor_id: doctor_id, // Pass the doctor_id here
//       });
//       alert(updateResponse.data.message || "Record updated successfully");
  
//       // Delete the appointment after updating the record
//       console.log(hdmisNumber)
//       console.log(doctor_id)
//       await axios.delete(`http://localhost:5000/deleteAppointment/${hdmisNumber}/${doctor_id}`);
//       alert("Appointment deleted successfully");
  
//       // Redirect to DoctorDashboard after saving
//       navigate(`/doctor-dashboard/${doctor_id}`);
//     } catch (error) {
//       alert(error.response?.data?.message);
//     }
//   };
  
  

//   return (
//     <div>
//       <Header />
//       <div className="container mt-4">
//         <h2 className="text-center mb-4">Doctor's Prescription</h2>

//         {loading ? (
//           <p className="text-center">Loading user details...</p>
//         ) : error ? (
//           <p className="text-danger text-center">{error}</p>
//         ) : userData ? (
//           <>
//             <div className="row">
//               {/* Patient Information */}
//               <div className="col-md-6">
//                 <div className="card p-3 mb-4">
//                   <h4>Patient Information</h4>
//                   <p><strong>HDMIS No:</strong> {userData.hdmis_number}</p>
//                   <p><strong>Name:</strong> {userData.full_name}</p>
//                   <p><strong>Age:</strong> {userData.age}</p>
//                   <p><strong>Gender:</strong> {userData.gender}</p>
//                   <p><strong>Contact:</strong> {userData.contact_number}</p>
//                   <p><strong>Email:</strong> {userData.email}</p>
//                   <p><strong>Address:</strong> {userData.address}</p>
//                 </div>
//               </div>

//               {/* Doctor Information */}
//               <div className="col-md-6">
//                 {doctorData ? (
//                   <div className="card p-3 mb-4">
//                     <h4>Doctor Information</h4>
//                     <p><strong>Name:</strong> {doctorData.name || "N/A"}</p>
//                     <p><strong>Specialization:</strong> {doctorData.specialization || "N/A"}</p>
//                     <p><strong>Contact:</strong> {doctorData.phone || "N/A"}</p>
//                     <p><strong>Email:</strong> {doctorData.email || "N/A"}</p>
//                     <p><strong>Available From:</strong> {doctorData.start_time}</p>
//                     <p><strong>Available To:</strong> {doctorData.end_time}</p>
//                   </div>
//                 ) : (
//                   <p className="text-warning">Doctor details not available.</p>
//                 )}
//               </div>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <label className="form-label">Disease</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={disease}
//                   onChange={(e) => setDisease(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Medicine</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={medicine}
//                   onChange={(e) => setMedicine(e.target.value)}
//                   required
//                 />
//               </div>

//               <button type="submit" className="btn btn-primary">Save</button>
//             </form>
//           </>
//         ) : (
//           <p className="text-center">No user data found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DoctorPrescription;

// ----------------------------------------------------------------------------
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Header from "../components/Header";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// const DoctorPrescription = () => {
//   const { doctor_id, hdmisNumber } = useParams();
//   const [userData, setUserData] = useState(null);
//   const [doctorData, setDoctorData] = useState(null);
//   const [medicines, setMedicines] = useState([]);
//   const [medicine, setMedicine] = useState("");
//   const [dosage, setDosage] = useState("");
//   const [instructions, setInstructions] = useState("");
//   const [disease, setDisease] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!hdmisNumber || !doctor_id) {
//       setError("Invalid patient or doctor ID");
//       setLoading(false);
//       return;
//     }

//     axios.get(`http://localhost:5000/getPatientDetails/${hdmisNumber}`)
//       .then((response) => setUserData(response.data))
//       .catch(() => setError("Failed to load user details."));

//     axios.get(`http://localhost:5000/getDoctorDetails/${doctor_id}`)
//       .then((response) => setDoctorData(response.data))
//       .catch(() => setError("Failed to load doctor details."))
//       .finally(() => setLoading(false));
//   }, [hdmisNumber, doctor_id]);

//   const addMedicine = () => {
//     if (medicine && dosage && instructions) {
//       setMedicines([...medicines, { medicine, dosage, instructions }]);
//       setMedicine("");
//       setDosage("");
//       setInstructions("");
//     }
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFont("helvetica", "bold");
//     doc.text("SNS Hospital", 80, 15);
//     doc.setFontSize(10);
//     doc.text("91001, Business Center, MG Road, Pune", 65, 22);
//     doc.text("Phone: +91 98765 43210", 85, 27);
//     doc.text("Email: info@snshospital.com", 80, 32);
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 15);
//     doc.line(10, 35, 200, 35);

//     doc.setFontSize(12);
//     doc.text("Patient Details", 10, 42);
//     doc.setFontSize(10);
//     doc.text(`Name: ${userData?.full_name || "N/A"}`, 10, 50);
//     doc.text(`Age: ${userData?.age || "N/A"} | Gender: ${userData?.gender || "N/A"}`, 10, 55);
//     doc.text(`HDMIS No: ${userData?.hdmis_number || "N/A"}`, 150, 50);
//     doc.line(10, 60, 200, 60);

//     doc.setFontSize(12);
//     doc.text("Clinical Complaints", 10, 68);
//     doc.setFontSize(10);
//     doc.text(`Disease: ${disease || "N/A"}`, 15, 75);
//     doc.line(10, 85, 200, 85);

//     doc.setFontSize(12);
//     doc.text("Prescription", 10, 93);

//     doc.autoTable({
//       startY: 98,
//       head: [["Medicine", "Dosage", "Instructions"]],
//       body: medicines.map(med => [med.medicine, med.dosage, med.instructions]),
//       theme: "grid",
//     });

//     let finalY = doc.lastAutoTable.finalY + 10;
//     doc.setFontSize(12);
//     doc.text("Doctor Details", 10, finalY);
//     doc.setFontSize(10);
//     doc.text(`Name: ${doctorData?.name || "N/A"}`, 10, finalY + 7);
//     doc.text(`Specialization: ${doctorData?.specialization || "N/A"}`, 10, finalY + 12);
//     doc.line(10, finalY + 20, 200, finalY + 20);
//     doc.text("Doctor's Signature: ___________", 140, finalY + 30);
//     doc.save("Prescription.pdf");
//   };
// //   const handleSubmit = async (event) => {
// //     event.preventDefault();
// //     if (!disease || !medicine) {
// //       alert("Please fill in all fields.");
// //       return;
// //     }
  
// //     try {
// //       // First, update the patient record
// //       const updateResponse = await axios.post("http://localhost:5000/updatePatientRecord", {
// //         hdmis_number: hdmisNumber,
// //         medicine,
// //         disease,
// //         doctor_id: doctor_id, // Pass the doctor_id here
// //       });
// //       alert(updateResponse.data.message || "Record updated successfully");
  
// //       // Delete the appointment after updating the record
// //       console.log(hdmisNumber)
// //       console.log(doctor_id)
// //       await axios.delete(`http://localhost:5000/deleteAppointment/${hdmisNumber}/${doctor_id}`);
// //       alert("Appointment deleted successfully");
  
// //       // Redirect to DoctorDashboard after saving
// //       navigate(`/doctor-dashboard/${doctor_id}`);
// //     } catch (error) {
// //       alert(error.response?.data?.message);
// //     }
// //   };
//   return (
//     <div>
//       <Header />
//       <div className="container mt-4">
//         <h2 className="text-center mb-4">Doctor's Prescription</h2>
//         {loading ? (
//           <p className="text-center">Loading user details...</p>
//         ) : error ? (
//           <p className="text-danger text-center">{error}</p>
//         ) : userData ? (
//           <>
//             <div className="mb-3">
//               <label className="form-label">Disease</label>
//               <input type="text" className="form-control" value={disease} onChange={(e) => setDisease(e.target.value)} required />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Medicine</label>
//               <input type="text" className="form-control" value={medicine} onChange={(e) => setMedicine(e.target.value)} required />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Dosage</label>
//               <input type="text" className="form-control" value={dosage} onChange={(e) => setDosage(e.target.value)} required />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Instructions</label>
//               <input type="text" className="form-control" value={instructions} onChange={(e) => setInstructions(e.target.value)} required />
//             </div>
//             <button className="btn btn-secondary me-2" onClick={addMedicine}>Add Medicine</button>
//             <button className="btn btn-primary" onClick={handleDownloadPDF}>Download as PDF</button>
//             <table className="table table-striped mt-4">
//               <thead>
//                 <tr>
//                   <th>Medicine</th>
//                   <th>Dosage</th>
//                   <th>Instructions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {medicines.map((med, index) => (
//                   <tr key={index}>
//                     <td>{med.medicine}</td>
//                     <td>{med.dosage}</td>
//                     <td>{med.instructions}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </>
//         ) : (
//           <p className="text-center">No user data found.</p>
//         )}
//       </div>
//       {/* //               <button type="submit" className="btn btn-primary">Save</button> */}

//     </div>

//   );
// };

// export default DoctorPrescription;
// // ----------------------------------------------------------------------------
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

    axios.get(`http://localhost:5000/getPatientDetails/${hdmisNumber}`)
      .then((response) => setUserData(response.data))
      .catch(() => setError("Failed to load user details."));

    axios.get(`http://localhost:5000/getDoctorDetails/${doctor_id}`)
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
      await axios.post("http://localhost:5000/updatePatientRecord", {
        hdmis_number: hdmisNumber,
        disease,
        doctor_id,
        medicines,
      });

      await axios.delete(`http://localhost:5000/deleteAppointment/${hdmisNumber}/${doctor_id}`);

      alert("Record updated successfully and appointment deleted.");
      navigate(`/doctor-dashboard/${doctor_id}`);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.text("SNS Hospital", 80, 15);
    doc.setFontSize(10);
    doc.text("91001, Business Center, MG Road, Pune", 65, 22);
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

    // Save PDF
    doc.save("Prescription.pdf");
  };

  return (
    <div>
      <Header />
      <div className="container mt-4">
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
              <button className="btn btn-secondary me-2" onClick={handleDownloadPDF}>Download as PDF</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
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
