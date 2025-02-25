import React from "react";
import { Link } from "react-router-dom"; // Import Link

const Logins = () => {
  return (
    <section id="logins" className="our-blog container-fluid">
      {/* <div className="container"> */}
        <div className="inner-title text-center">
          <h1>Logins</h1>
        </div>
        <div className="row d-flex justify-content-between">
          
          {/* Patient Login - Left Side */}
          <div className="col-sm-5 blog-smk">
            <div className="blog-single text-center">
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
