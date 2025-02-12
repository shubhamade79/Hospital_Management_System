const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require("nodemailer");
const multer = require("multer");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ehr.management.team@gmail.com",  // Replace with your Gmail
        pass: "hqtcekitycivmugh",   // Use App Password if 2FA is enabled
    },
});
// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// MongoDB Connection
const MONGO_URI = "mongodb+srv://shubhamgormati:wzhp7NQHhQ9BdXLY@hospitalmanagementsyste.6ofik.mongodb.net/hdmis?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

app.post("/sendHdmisEmail", async (req, res) => {
    const { email, hdmis_number } = req.body;

    if (!email || !hdmis_number) {
        return res.status(400).json({ error: "Email and HDMIS number are required" });
    }

    const mailOptions = {
        from: "ehr.management.team@gmail.com",
        to: email,
        subject: "Your HDMIS Number",
        text: `Hello, Your HDMIS Number is: ${hdmis_number}. Keep it safe!`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "HDMIS Number sent successfully!" });
    } catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});
// const counterSchema = new mongoose.Schema({
//     _id: String,
//     seq: { type: Number, default: 0 }
// });

// const Counter = mongoose.model("Counter", counterSchema); 

// Aadhaar Schema
const AadharSchema = new mongoose.Schema({
    aadhar_number: { type: String, unique: true, required: true },
    full_name: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pin_code: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], required: true },
    created_at: { type: Date, default: Date.now }
});

const AadharDetails = mongoose.model("AadharDetails", AadharSchema);

// Users Schema
const UserSchema = new mongoose.Schema({
    aadhar_number: { type: String, unique: true, required: true },
    full_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    hdmis_number: { type: String, unique: true, required: true },
    created_at: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);

// HDMIS Number Generator
const generateHDMISNumber = () => {
    const digits = "0123456789";
    let hdmisDigits = "";
    for (let i = 0; i < 6; i++) {
        hdmisDigits += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return "HDMIS" + hdmisDigits;
};

// Endpoint to get full name based on Aadhaar number
app.post('/getAadhaarDetails', async (req, res) => {
    const { aadhaar_number } = req.body;

    if (!aadhaar_number) {
        return res.status(400).json({ message: 'Aadhaar number is required' });
    }

    try {
        // Check if Aadhaar already exists in users table
        const existingUser = await User.findOne({ aadhar_number: aadhaar_number });
        if (existingUser) {
            return res.status(409).json({ message: 'Aadhaar number already exists in the users table' });
        }

        // Fetch full name from AadharDetails collection
        const aadhaar = await AadharDetails.findOne({ aadhar_number: aadhaar_number });
        if (!aadhaar) {
            return res.status(404).json({ message: 'Aadhaar number not found in AadharDetails' });
        }

        res.json({ full_name: aadhaar.full_name , phone_number: aadhaar.phone_number , email: aadhaar.email});
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).json({ message: 'Database error' });
    }
});

// Route to store Aadhaar details and generate HDMIS number
app.post("/storeAadhaar", async (req, res) => {
    const { aadhaar_number, full_name, password } = req.body;

    if (!aadhaar_number || !full_name || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if Aadhaar exists in AadharDetails collection
        const aadhaar = await AadharDetails.findOne({ aadhar_number: aadhaar_number });
        if (!aadhaar) {
            return res.status(404).json({ message: "Aadhaar number not found" });
        }

        // Check if Aadhaar already exists in Users collection
        const existingUser = await User.findOne({ aadhar_number: aadhaar_number });
        if (existingUser) {
            return res.status(409).json({ message: "Aadhaar already exists in users table" });
        }

        // Generate HDMIS number
        const hdmis_number = generateHDMISNumber();

        // Insert new user
        const newUser = new User({
            aadhar_number: aadhaar_number,
            full_name,
            password,  // Store hashed password in production
            phone_number: aadhaar.phone_number,  // Fetch from AadhaarDetails
            email: aadhaar.email,  // Fetch from AadhaarDetails
            hdmis_number
        });

        await newUser.save();

        res.json({
            message: "User stored successfully",
            hdmis_number
        });
    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).json({ message: "Database error" });
    }
});


// User Schemas
const DoctorSchema = new mongoose.Schema({
    doctor_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    start_time: { type: String, required: true },  // Stored as HH:MM format
    end_time: { type: String, required: true },    // Stored as HH:MM format
    password: { type: String, required: true },
    admin_id: { type: String, required: true },
    hospital_name: { type: String, required: true },
    hospital_address: { type: String, required: true },
    hospital_city: { type: String, required: true },
    hospital_state: { type: String, required: true },

});

const HospitalAdminSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    hospital_name: { type: String, required: true },
    hospital_address: { type: String, required: true },
    hospital_city: { type: String, required: true },
    hospital_state: { type: String, required: true },
}, { timestamps: true }); // Automatically adds createdAt & updatedAt fields



const HospitalLoginSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now }, // Automatically set timestamp
    admin_id: { type: String, required: false }, // Nullable
    contact: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    hospital_address: { type: String, required: true },
    hospital_name: { type: String, required: true },
    hospital_city: { type: String, required: true },
    hospital_state: { type: String, required: true },

});

const Doctor = mongoose.model("Doctor", DoctorSchema);
const HospitalAdmin = mongoose.model("HospitalAdmin", HospitalAdminSchema);
const HospitalLogin = mongoose.model("HospitalLogin", HospitalLoginSchema);

// Hospital Login Endpoint
app.post("/hospitalLogin", async (req, res) => {
    const { user_id, password, role } = req.body;
    
    console.log("Received login request:", req.body); // Debugging statement

    if (!user_id || !password || !role) {
        return res.status(400).json({ message: "User ID, Password, and Role are required" });
    }

    try {
        let user;
        
        if (role === "Doctor") {
            user = await Doctor.findOne({ doctor_id: user_id });
        } else if (role === "Hospital Admin") {
            user = await HospitalAdmin.findOne({ user_id: user_id });
        } else {
            user = await HospitalLogin.findOne({ user_id: user_id});
        }

        if (!user) {
            return res.status(404).json({ message: "User not found or role mismatch" });
        }

        console.log("Database retrieved user:", user); // Debugging statement

        if (user.password === password) {  
            return res.json({
                message: "Login successful",
                user: {
                    id: user._id,
                    user_id: user.user_id || user.doctor_id, 
                    full_name: user.full_name || "User", 
                    role: role,
                    hospital_name: user.hospital_name || null, // For admin
                    hospital_address: user.hospital_address || null // For admin
                }
            });
        } else {
            return res.status(400).json({ message: "Incorrect password" });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
});



// Patient Login Endpoint
app.post("/login", async (req, res) => {
    const { hdmis_number, password } = req.body;

    if (!hdmis_number || !password) {
        return res.status(400).json({ message: "HDMIS Number and Password are required" });
    }

    try {
        const user = await User.findOne({ hdmis_number });
        
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        console.log("Aadhaar Number:", user.aadhar_number);  
        console.log("Full name:", user.full_name);  
        console.log("HDMIS Number:", user.hdmis_number);  


        if (user.password === password) {
            return res.json({
                message: "Login successful",
                patient: {  // ✅ Rename "user" to "patient" for consistency
                    full_name: user.full_name,
                    patient_id: user.hdmis_number, // ✅ Use "patient_id" instead of "hdmis_number"
                    aadhar_number: user.aadhar_number
                }
            });
            
        } else {
            return res.status(400).json({ message: "Incorrect password" });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Database error" });
    }
});


const appointmentSchema = new mongoose.Schema({
    // appointment_id: { type: Number, unique: true }, // Auto-increment field
    hdmis_number: { type: String, required: true },
    doctor_id: { type: String, required: true },
    date: { type: String, required: true },
    reception_id: { type: String, required: true }, // Add the reception_id field
    time: { type: String, required: true }
}, { timestamps: true });

// // Pre-save hook to auto-increment appointment_id
// appointmentSchema.pre("save", async function (next) {
//     if (!this.appointment_id) {
//         try {
//             const counter = await Counter.findByIdAndUpdate(
//                 { _id: "appointment_id" }, 
//                 { $inc: { seq: 1 } }, 
//                 { new: true, upsert: true }
//             );
//             this.appointment_id = counter.seq;
//         } catch (error) {
//             return next(error);
//         }
//     }
//     next();
// });

const patientSchema = new mongoose.Schema({
    hdmis_number: String,
    full_name: String,
    age: Number,
    gender: String,
    contact_number: String,
    email: String,
    address: String,
    appointment_id: { type: Number }, // Auto-increment field

});

const Patient = mongoose.model("patient_detail_for_appointment", patientSchema);

const Appointment = mongoose.model("appointment", appointmentSchema);

// Get Patient by HDMIS Number
app.get("/api/patient_detail_for_appointment/:hdmisNumber", async (req, res) => {
    try {
        const patient = await Patient.findOne({ hdmis_number: req.params.hdmisNumber });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Insert the data
app.post("/api/patient_detail_for_appointment", async (req, res) => {
    try {
        const { hdmis_number, age, gender, address } = req.body;
        
        // Check if HDMIS number exists in the 'users' collection
        const user = await mongoose.connection.db.collection("users").findOne({ hdmis_number });
        if (!user) {
            return res.status(404).json({ message: "HDMIS Number not found in users collection" });
        }

        const patient = new Patient({
            hdmis_number,
            full_name: user.full_name,
            age,
            gender,
            contact_number :user.phone_number,
            email:user.email,
            address
        });
        
        await patient.save();
        res.status(200).json({ message: "Patient registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering patient", error });
    }
});

// Select Doctor For Appointment
app.get("/api/doctors", async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

// Appointment Book For Reception
app.post("/api/book_appointment", async (req, res) => {
    const { hdmis_number, doctor_id,reception_id, hospital_id, date, time } = req.body;
  
    try {
      // Ensure no duplicate appointment exists for the same doctor, patient, and date
      const existingAppointment = await Appointment.findOne({ hdmis_number, doctor_id, date });
  
      if (existingAppointment) {
        return res.status(400).json({ message: "Appointment already exists for this patient and doctor on the selected date." });
      }
  
      // Create a new appointment
      const newAppointment = new Appointment({
        hdmis_number,
        doctor_id,
        hospital_id,
        reception_id,
        date,
        time,
      });
  
      await newAppointment.save();
  
  
      res.status(201).json({ message: "Appointment booked successfully!", appointment: newAppointment });
  
    } catch (error) {
      console.error("Error booking appointment:", error);
      res.status(500).json({ message: "Error booking appointment. Try again." });
    }
  });
  


//Fetch Appoinment Doctor Wise
app.get("/doctorAppointments", async (req, res) => {
    try {
        const { doctor_id } = req.query;
        
        if (!doctor_id) {
            return res.status(400).json({ error: "Doctor ID is required" });
        }

        // Get today's date in 'YYYY-MM-DD' format
        const today = new Date().toLocaleDateString("en-CA");

        // Fetch appointments
        const appointments = await Appointment.find({ doctor_id, date: today });

        if (appointments.length === 0) {
            return res.json({ message: "No appointments found for today" });
        }

        // Extract hdmis_numbers from appointments
        const hdmisNumbers = appointments.map(appointment => appointment.hdmis_number);

        // Fetch patient details
        const patients = await Patient.find({ hdmis_number: { $in: hdmisNumbers } });

        // Map patient details to appointments
        const appointmentDetails = appointments.map(appointment => {
            const patientInfo = patients.find(patient => patient.hdmis_number === appointment.hdmis_number) || {};
            return {
                appointment_id: appointment.appointment_id,
                hdmis_number: appointment.hdmis_number,
                date: appointment.date,
                time: appointment.time,
                patient_info: {
                    full_name: patientInfo.full_name,
                    age: patientInfo.age ,
                    gender: patientInfo.gender ,
                    contact_number: patientInfo.contact_number,
                    email: patientInfo.email ,
                    address: patientInfo.address 
                }
            };
        });

        res.json(appointmentDetails);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Database error", details: error.message });
    }
});


const MedicalRecordSchema = new mongoose.Schema({
    hdmis_number: { type: String, required: true, index: true }, // Indexed for faster search
    doctor_id: { type: String, required: true, index: true }, // Store doctor_id as string
    disease: { type: String, required: true },
    // medicine: [
    //     {
    //         name: { type: String, required: true },
    //         dosage: { type: String, required: true },
    //         instructions: { type: String, required: true }
    //     }
    // ]
    created_at: { type: Date, default: Date.now },// Equivalent to `timestamp DEFAULT current_timestamp()`
    hospital_address: { type: String, required: true },
    hospital_name: { type: String, required: true },
    hospital_city: { type: String, required: true },
    hospital_state: { type: String, required: true },
    filePath: {type: String},
});

const MedicalRecord = mongoose.model("MedicalRecord", MedicalRecordSchema);



app.post("/updatePatientRecord", async (req, res) => {
    try {
        const { hdmis_number, medicine, disease, doctor_id,hospital_name,hospital_address,hospital_state,hospital_city,filePath } = req.body;

        if (!hdmis_number || !disease || !doctor_id) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Create a new medical record
        const newRecord = new MedicalRecord({
            hdmis_number,
            disease,
            doctor_id,  // Assign the doctor_id received from the request
            hospital_name,
            hospital_address,
            hospital_state,
            hospital_city,
            filePath,
        });

        // Save the new medical record
        await newRecord.save();
        res.json({ message: "Record updated successfully" });

    } catch (error) {
        console.error("Error updating patient record:", error);
        res.status(500).json({ message: "Database error" });
    }
});



app.get("/getPatientDetails/:hdmisNumber", async (req, res) => {
    try {
        const { hdmisNumber } = req.params;
        const patient = await Patient.findOne({ hdmis_number: hdmisNumber });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json(patient);
    } catch (error) {
        console.error("Error fetching patient details:", error);
        res.status(500).json({ message: "Database error" });
    }
});

app.get("/getDoctorDetails/:doctorId", async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        // Fetch doctor details using doctor_id (not _id)
        const doctor = await Doctor.findOne({ doctor_id: doctorId });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.json(doctor);
    } catch (error) {
        console.error("Error fetching doctor details:", error);
        res.status(500).json({ message: "Database error" });
    }
});

 
// Delete appointment data
app.delete("/deleteAppointment/:hdmis_number/:doctor_id", (req, res) => {
    const { hdmis_number, doctor_id } = req.params;
  
    // First, delete the appointment from the appointments collection
    Appointment.findOneAndDelete({ hdmis_number, doctor_id })
      .then((appointment) => {
        if (!appointment) {
          return res.status(404).json({ message: "No appointment found to delete" });
        }
  
        // Now remove the appointment_id from the doctor schema
        Doctor.findOneAndUpdate(
          { doctor_id },
          { $pull: { appointment_id: appointment.appointment_id } }, // Remove the appointment ID from the doctor
          { new: true }
        )
          .then((doctor) => {
            if (!doctor) {
              return res.status(404).json({ message: "Doctor not found" });
            }
  
            res.json({ message: "Appointment deleted and doctor updated successfully" });
          })
          .catch((err) => {
            console.error("Error updating doctor:", err);
            return res.status(500).json({ message: "Failed to update doctor" });
          });
      })
      .catch((err) => {
        console.error("Error deleting appointment:", err);
        return res.status(500).json({ message: "Failed to delete appointment" });
      });
  });



app.get('/doctors', async (req, res) => {
    try {
      const { admin_id } = req.query; // Get admin_id from query params
  
      if (!admin_id) {
        return res.status(400).json({ message: 'Admin ID is required' });
      }
  
      // Fetch doctors based on admin_id
      const doctors = await Doctor.find({ admin_id });  // Assuming Doctor schema has an admin_id field
  
      res.json(doctors);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Database error' });
    }
  });

  
  app.get('/receptions', async (req, res) => {
    try {
      const { admin_id } = req.query; // Get admin_id from query params
  
      if (!admin_id) {
        return res.status(400).json({ message: 'Admin ID is required' });
      }
  
      // Fetch receptionists based on admin_id
      const receptions = await HospitalLogin.find({ admin_id }); // Assuming HospitalLogin schema has an admin_id field
  
      res.json(receptions);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Database error' });
    }
  });


  app.post("/add-doctor", async (req, res) => {
    try {
      const { doctor_id, password, phone, name, specialization, email, hospital_name,hospital_address, admin_id, start_time, end_time ,hospital_city,hospital_state} = req.body;
  
      // Validate required fields
      if (!doctor_id || !password || !phone || !name || !specialization || !email || !hospital_name || !admin_id || !start_time || !end_time) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
      const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ error: "Email is already registered!" });
        }
  
      // Create a new doctor document
      const newDoctor = new Doctor({
        doctor_id,
        password,  
        phone,
        name,
        specialization,
        email,
        hospital_name,
        hospital_address,
        hospital_city,
        hospital_state,
        admin_id,
        start_time,  // Ensure this is included
        end_time     // Ensure this is included
      });
        
      // Email content
      let mailOptions = {
        from: admin_id,
        to: email,
        subject: "Doctor Registration Successful",
        text: `Hello Dr. ${name},\n\nYou have been successfully registered at ${hospital_name}.\n\nYour Login Credentials:\nDoctor ID: ${doctor_id}\nPassword: ${password}\n\nPlease keep this information safe.\n\nRegards,\nHospital Management Team`,
      };
  
      // Send email
      await transporter.sendMail(mailOptions);
      // Save to MongoDB
      await newDoctor.save();
      res.json({ success: true, message: "Doctor registered successfully!" });
  
    } catch (error) {
      console.error("Error registering doctor:", error);
      res.status(500).json({ success: false, message: "Error registering doctor" });
    }
  });
  

app.post("/add-receptionist", async (req, res) => {
  try {
    const { user_id, password, contact, name, hospital_name,hospital_address, admin_id ,email,hospital_city,hospital_state} = req.body;

    if (!user_id || !password || !contact || !name || !hospital_name || !admin_id || !email) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Create a new receptionist document
    const newReceptionist = new HospitalLogin({
      user_id,
      password,  // Password stored as plain text
      contact,
      email,
      name,
      hospital_name,
      hospital_address,
      admin_id,
      hospital_city,
      hospital_state,
    });
    // Email content
    let mailOptions = {
        from: admin_id,
        to: email,
        subject: "Receptionist Registration Successful",
        text: `Hello ${name},\n\nYou have been successfully registered at ${hospital_name}.\n\nYour Login Credentials:\nUser ID: ${user_id}\nPassword: ${password}\n\nPlease keep this information safe.\n\nRegards,\nHospital Management Team`,
    };
  
      // Send email
      await transporter.sendMail(mailOptions);

    // Save to MongoDB
    await newReceptionist.save();
    res.json({ success: true, message: "Receptionist registered successfully!" });

  } catch (error) {
    console.error("Error registering receptionist:", error);
    res.status(500).json({ success: false, message: "Error registering receptionist" });
  }
});

// API to get hospital name based on admin_id
app.get("/get-hospital-name", async (req, res) => {
    const { admin_id } = req.query;

    if (!admin_id) {
        return res.status(400).json({ message: "Admin ID is required." });
    }

    try {
        const hospitalAdmin = await HospitalAdmin.findOne({ user_id: admin_id });

        if (hospitalAdmin) {
            res.status(200).json({
                hospital_name: hospitalAdmin.hospital_name,
                hospital_address: hospitalAdmin.hospital_address,
                hospital_city:hospitalAdmin.hospital_city,
                hospital_state:hospitalAdmin.hospital_state
            });
        } else {
            res.status(404).json({ message: "Hospital not found." });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Database error." });
    }
});



// Fetch doctor details (MongoDB)
app.get("/doctor/:id", async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ doctor_id: req.params.id });
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
      res.json(doctor);
    } catch (err) {
      console.error("Error fetching doctor details:", err);
      res.status(500).json({ error: "Database error" });
    }
  });


  // Update doctor details (MongoDB)
app.put("/doctor/:doctor_id", async (req, res) => {
    try {
      const { name, specialization, email, hospital_name } = req.body;
      const updatedDoctor = await Doctor.findOneAndUpdate(
        { doctor_id: req.params.doctor_id },
        { name, specialization, email, hospital_name },
        { new: true }  // Return updated document
      );
  
      if (!updatedDoctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
      res.json({ message: "Doctor updated successfully!", doctor: updatedDoctor });
    } catch (err) {
      console.error("Error updating doctor details:", err);
      res.status(500).json({ error: "Failed to update doctor details." });
    }
  });

  
  app.get("/reception/:user_id", async (req, res) => {
    try {
      const receptionist = await HospitalLogin.findOne({ user_id: req.params.user_id });
  
      if (!receptionist) {
        return res.status(404).json({ error: "Receptionist not found" });
      }
  
      res.json(receptionist);
    } catch (err) {
      console.error("Error fetching receptionist details:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  app.put("/reception/:user_id", async (req, res) => {
    try {
      const { name, contact, hospital_name } = req.body;
  
      const updatedReceptionist = await HospitalLogin.findOneAndUpdate(
        { user_id: req.params.user_id },
        { name, contact, hospital_name },
        { new: true }  // Return updated document
      );
  
      if (!updatedReceptionist) {
        return res.status(404).json({ error: "Receptionist not found" });
      }
  
      res.json({ message: "Receptionist updated successfully!", receptionist: updatedReceptionist });
    } catch (err) {
      console.error("Error updating receptionist details:", err);
      res.status(500).json({ error: "Failed to update receptionist details." });
    }
  });
 
  
 // **API to Fetch Appointments for a Reception**
 app.get("/get-appointments", async (req, res) => {
    try {
        const { reception_id, date } = req.query;

        if (!reception_id) {
            return res.status(400).json({ message: "Reception ID is required." });
        }

        // Fetch appointments based on reception_id and date
        const appointments = await Appointment.find({ reception_id, date });

        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found." });
        }

        // Extract hdmis_numbers from appointments
        const hdmisNumbers = appointments.map(appointment => appointment.hdmis_number);

        // Fetch patient details in bulk
        const patients = await Patient.find({ hdmis_number: { $in: hdmisNumbers } });

        // Map patient details to appointments
        const appointmentDetails = appointments.map(appointment => {
            const patientInfo = patients.find(patient => patient.hdmis_number === appointment.hdmis_number) || {};
            return {
                appointment_id: appointment._id,
                hdmis_number: appointment.hdmis_number,
                date: appointment.date,
                time: appointment.time,
                status: appointment.status || "Pending",
                patient_name: patientInfo.full_name || "Unknown", // ✅ Adding `patient_name`
            };
        });

        res.status(200).json({ appointments: appointmentDetails });

    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Failed to fetch appointments. Please try again.", error: error.message });
    }
});

app.delete("/api/delete-doctor/:doctor_id", async (req, res) => {
    try {
      const { doctor_id } = req.params;
      const deletedDoctor = await Doctor.findOneAndDelete({ doctor_id });
  
      if (!deletedDoctor) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
      }
  
      res.json({ success: true, message: "Doctor deleted successfully" });
    } catch (error) {
      console.error("Error deleting doctor:", error);
      res.status(500).json({ success: false, message: "Error deleting doctor" });
    }
  });

  
  app.delete("/api/delete-receptionist/:user_id", async (req, res) => {
    try {
      const { user_id } = req.params;
      const deletedReceptionist = await HospitalLogin.findOneAndDelete({ user_id });
  
      if (!deletedReceptionist) {
        return res.status(404).json({ success: false, message: "Receptionist not found" });
      }
  
      res.json({ success: true, message: "Receptionist deleted successfully" });
    } catch (error) {
      console.error("Error deleting receptionist:", error);
      res.status(500).json({ success: false, message: "Error deleting receptionist" });
    }
  });

  // ✅ DELETE Appointment API
  app.delete("/delete-appointment/:appointment_id", async (req, res) => {
    try {
        const { appointment_id } = req.params;
        console.log("Deleting Appointment ID:", appointment_id);

        // Check if the appointment exists
        const result = await Appointment.findOneAndDelete({ _id: appointment_id });

        if (!result) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json({ message: "Appointment deleted successfully", deleted: result });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ message: "Error deleting appointment", error });
    }
});


app.get("/medical-records/:hdmis_number", async (req, res) => {
    const { hdmis_number } = req.params;

    try {
        const records = await MedicalRecord.find({ hdmis_number });

        if (records.length === 0) {
            return res.status(404).json({ message: "No medical records found" });
        }

        res.json(records);
    } catch (error) {
        console.error("Error fetching medical records:", error);
        res.status(500).json({ message: "Database error" });
    }
});

app.post("/storeManualUser", async (req, res) => {
    const { full_name, email, phone_number, password } = req.body;

    if (!full_name || !email || !phone_number || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if email or phone number already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email" });
        }

        // Generate HDMIS number
        const hdmis_number = generateHDMISNumber();

        // Store user
        const newUser = new User({
            aadhar_number:"NA",
            full_name,
            email,
            phone_number,
            password, // Hash this in production
            hdmis_number
        });

        await newUser.save();
        res.json({ message: "User stored successfully", hdmis_number });
    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).json({ message: "Database error" });
    }
});
const otpStore = new Map();  // Define otpStore to store OTPs

const findUserByIdAndRole = async (id, role) => {
    let user;
    switch (role) {
        case "Doctor":
            user = await Doctor.findOne({ doctor_id: id });
            break;
        case "Receptionist":
            user = await HospitalLogin.findOne({ user_id: id });
            break;
        case "Admin":
            user = await HospitalAdmin.findOne({ user_id: id });
            break;
        default:
            return null;
    }
    return user ? { user, email: user.email, role } : null;
};

app.post("/send-otp", async (req, res) => {
    const { id, role } = req.body;

    const userInfo = await findUserByIdAndRole(id, role);
    if (!userInfo) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore.set(userInfo.email, otp);

    console.log("Generated OTP for", userInfo.email, ":", otp);

    const mailOptions = {
        from: "ehr.management.team@gmail.com",
        to: userInfo.email,
        subject: "Password Reset OTP",
        text: `Your OTP is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Email sending error:", error);
            return res.status(500).json({ message: "Failed to send OTP" });
        }
        res.json({ success: true, message: "OTP sent to email", email: userInfo.email });
    });
});



app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;
    console.log("Received OTP verification request:", email, otp);
    console.log("Stored OTPs:", otpStore);

    const storedOtp = otpStore.get(email);
    if (storedOtp && String(storedOtp) === String(otp)) {
        otpStore.delete(email);
        return res.json({ success: true });
    } else {
        return res.status(400).json({ message: "Invalid OTP" });
    }
});


app.post("/reset-password", async (req, res) => {
    const { id, role, newPassword } = req.body;

    const userInfo = await findUserByIdAndRole(id, role);
    if (!userInfo) return res.status(400).json({ message: "User not found" });

    try {
        userInfo.user.password = newPassword;  // Directly saving the new password
        await userInfo.user.save();

        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Error resetting password" });
    }
});
// Forgot Password (Send OTP)
app.post("/forgot-password_patient", async (req, res) => {
    try {
        const { hdmis_number } = req.body;
        const user = await User.findOne({ hdmis_number });

        if (!user) return res.status(400).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        const expiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        otpStore.set(hdmis_number, { otp, expiry });

        await transporter.sendMail({
            from: "ehr.management.team@gmail.com",
            to: user.email,
            subject: "HDMIS - Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}`
        });

        res.json({ message: "OTP sent to your email" });


    } catch (err) {
        res.status(500).json({ message: "Error sending OTP" });
    }
});


app.post("/reset-password_patient", async (req, res) => {
    try {
        const { hdmis_number, otp, new_password } = req.body;

        const storedOtpData = otpStore.get(hdmis_number);

        if (!storedOtpData || storedOtpData.otp !== parseInt(otp) || storedOtpData.expiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const user = await User.findOne({ hdmis_number });
        if (!user) return res.status(400).json({ message: "User not found" });

        user.password = new_password; // ⚠️ Storing password in plaintext is insecure
        await user.save();

        otpStore.delete(hdmis_number); // Remove OTP after successful reset

        res.json({ message: "Password reset successful" });

    } catch (err) {
        res.status(500).json({ message: "Error resetting password" });
    }
});

const fs = require("fs");

// Multer Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = "./uploads/prescriptions/";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
        console.log(req.body.hdmis_number)
        const hdmisNumber = req.body.hdmis_number || "Unknown";
        cb(null, `Prescription_${hdmisNumber}_${Date.now()}.pdf`);
    },
  });
  
  const upload = multer({ storage });

// Endpoint to upload prescription PDF
// Upload Prescription PDF
app.post("/uploadPrescription", upload.single("pdf"), async (req, res) => {
    try {
        
      const filePath = `/uploads/prescriptions/${req.file.filename}`;
  
      // Save to MongoDB
      await MedicalRecord.updateOne(
        { $set: { filePath } },
        { upsert: true }
      );
  
      res.json({ message: "File uploaded successfully", filePath });
    } catch (error) {
      res.status(500).json({ message: "File upload failed", error });
    }
  });
  

// Default Route
app.get('/', (req, res) => {
    res.send('Health Data Information and Management System API');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
