import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    passkey: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.passkey !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        setError("Signup failed");
      } else {
        alert("Registration successful");
        window.location.href = "/";
      }

    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">

      <div className="row shadow rounded overflow-hidden" style={{ width: "900px" }}>

        {/* LEFT SIDE (FORM) */}
        <div className="col-md-6 bg-white p-5">

          <h3 className="fw-bold mb-4 text-center">Create Account</h3>

          {error && (
            <div className="alert alert-danger text-center py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control rounded-pill px-3"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control rounded-pill px-3"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control rounded-pill px-3"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Username</label>
              <input
                type="text"
                name="username"
                className="form-control rounded-pill px-3"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                name="passkey"
                className="form-control rounded-pill px-3"
                placeholder="Create a password"
                value={formData.passkey}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control rounded-pill px-3"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-success w-100 rounded-pill mb-3">
              Register
            </button>

            <div className="text-center">
              <small>
                Already have an account?{" "}
                <Link to="/" className="fw-semibold">
                  Login
                </Link>
              </small>
            </div>

          </form>

        </div>

        {/* RIGHT SIDE (GRADIENT INFO PANEL) */}
        <div
          className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white p-5"
          style={{
            background: "linear-gradient(135deg, #667eea, #764ba2)"
          }}
        >

          <h2 className="fw-bold mb-3">Welcome 🎉</h2>

          <p className="text-center mb-4">
            Start managing your wallet securely and efficiently.
          </p>

          {/* Feature Tags */}
          <div className="d-flex flex-wrap justify-content-center gap-2">

            <span className="badge bg-light text-dark px-3 py-2">
              🔐 Secure Login
            </span>

            <span className="badge bg-light text-dark px-3 py-2">
              ⚡ Instant Transfer
            </span>

            <span className="badge bg-light text-dark px-3 py-2">
              💳 Easy Payments
            </span>

            <span className="badge bg-light text-dark px-3 py-2">
              📊 Smart Tracking
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;