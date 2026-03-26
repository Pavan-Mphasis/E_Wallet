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
        setOtp("");
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
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          textAlign: "center"
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          style={{
            width: "64px",
            height: "64px",
            background: "linear-gradient(135deg, #3b82f6, #0ea5e9)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)"
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
        </motion.div>

        <h3 className="fw-bold text-white mb-2" style={{ letterSpacing: "-0.5px" }}>2-Step Verification</h3>
        
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "32px", lineHeight: "1.6" }}>
          Verifying secure access for <br/><strong className="text-white fw-bold">{username}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label" style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "500", textAlign: "left", width: "100%", paddingLeft: "5px" }}>
              Authentication Code
            </label>
            <input
              type="text"
              autoFocus
              className="form-control text-center"
              placeholder="000 000"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                if (val.length <= 6) setOtp(val);
              }}
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#fff",
                fontSize: "28px",
                letterSpacing: "12px",
                borderRadius: "16px",
                padding: "16px",
                transition: "all 0.3s ease",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.2)";
              }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn w-100 fw-semibold"
            disabled={loading || otp.length !== 6}
            style={{
              background: otp.length === 6 ? "linear-gradient(135deg, #3b82f6, #0ea5e9)" : "rgba(255,255,255,0.05)",
              color: otp.length === 6 ? "#fff" : "#64748b",
              padding: "16px",
              borderRadius: "14px",
              border: otp.length === 6 ? "none" : "1px solid rgba(255,255,255,0.1)",
              boxShadow: otp.length === 6 ? "0 8px 20px rgba(59, 130, 246, 0.3)" : "none",
              transition: "all 0.3s ease"
            }}
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </motion.button>
        </form>

        <p className="mt-4 mb-0" style={{ color: "#64748b", fontSize: "13px" }}>
          Open your Authenticator app to view your code.
        </p>
      </motion.div>
    </div>
  );
}

export default MFA;