import React from "react";
import "./Logins.css";
import { Link } from "react-router-dom"; // Import Link
import hospital_login_img from "./Home_img/admin.jpg";
import patient_login_img from "./Home_img/patient.jpg";
const Logins = () => {
  return (
    <section id="logins" className="our-blog container-fluid">
      {/* <div className="container"> */}
        <div className="inner-title text-center">
          <h1>Logins</h1>
        </div>
        <div className="row d-flex justify-content-center">
          
          {/* Patient Login - Left Side */}
          <div className="col-sm-5 blog-smk">
            <div className="blog-single text-center">
            <img src={patient_login_img} alt="patient login" />
              <div className="blog-single-det">
                <h6>Patient Login</h6>
                <Link to="/patient-login">
                  <button className="btn btn-success btn-sm">Click Here</button>
                </Link>
              </div>
            </div>
          </div>

          {/* Hospital Login - Right Side */}
          <div className="col-sm-5 blog-smk">
            <div className="blog-single text-center">
            <img src={hospital_login_img} alt="patient login" />
              <div className="blog-single-det">
                <h6>Hospital Login</h6>
                <Link to="/hospital-login">
                  <button className="btn btn-success btn-sm">Click Here</button>
                </Link>
              </div>
            {/* </div> */}
          </div>
{/* Admin Login
            <div className="col-sm-4 blog-smk">
              <div className="blog-single">
                <div className="blog-single-det">
                  <h6>Admin Login</h6>
                  <Link to="/admin-login">
                    <button className="btn btn-success btn-sm">Click Here</button>
                  </Link>
                </div>
              </div>
            </div> */}
        </div>
      </div>
    </section>
  );
};

export default Logins;
