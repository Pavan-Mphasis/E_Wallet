import React, { useState } from "react";
import { motion } from "framer-motion";

function MFA() {

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const username = localStorage.getItem("username");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    const token = localStorage.getItem("tempToken");

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ otp })
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.removeItem("tempToken");

        window.location.href = "/dashboard";
      } else {
        alert("Invalid OTP. Please try again.");
      }

    } catch {
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #A28dd2, #FBC2EB)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: "380px",
          background: "#ffffff",
          borderRadius: "18px",
          padding: "35px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
          textAlign: "center"
        }}
      >

        {/* TITLE */}
        <h3 className="fw-bold mb-1">Two-Factor Verification</h3>

        {/* 👤 USERNAME DISPLAY */}
        <p
          style={{
            fontSize: "14px",
            color: "#374151",
            marginBottom: "15px"
          }}
        >
          Verifying account for <b>{username}</b>
        </p>

        <p className="text-muted mb-4" style={{ fontSize: "14px" }}>
          Enter the 6-digit code from your <b>Authenticator app</b>
        </p>

        {/* INFO BOX */}
        <div
          className="mb-4 p-3"
          style={{
            background: "#f9fafb",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            fontSize: "13px",
            textAlign: "left"
          }}
        >
          <strong>Instructions:</strong>
          <ul className="mb-0 mt-2 ps-3 text-muted">
            <li>Open Google Authenticator</li>
            <li>Find your E-Wallet account</li>
            <li>Enter the 6-digit code shown</li>
          </ul>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <input
            type="text"
            className="form-control mb-3 text-center"
            placeholder="••••••"
            value={otp}
            onChange={(e)=>setOtp(e.target.value)}
            maxLength="6"
            style={{
              fontSize: "24px",
              letterSpacing: "8px",
              borderRadius: "12px",
              padding: "10px"
            }}
          />

          <button
            className="btn btn-dark w-100 rounded-pill"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-muted mt-4" style={{ fontSize: "12px" }}>
          Make sure your device time is synced for correct OTP
        </p>

      </motion.div>

    </div>
  );
}

export default MFA;