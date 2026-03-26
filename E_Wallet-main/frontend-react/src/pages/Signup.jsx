import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    passkey: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.passkey !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8081/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        setError("Signup failed. Username might be taken.");
      } else {
        alert("Registration successful! Please login.");
        navigate("/");
      }
    } catch {
      setError("Server error. Please try again later.");
    }
    setLoading(false);
  };

  const inputStyle = {
    background: "rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#fff",
    borderRadius: "12px",
    padding: "12px 16px",
    transition: "all 0.3s ease",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
  };

  const labelStyle = { color: "#cbd5e1", fontSize: "13px", fontWeight: "500", marginBottom: "6px" };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <div className="container" style={{ maxWidth: "1000px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="row overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "24px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          {/* LEFT SIDE (FORM) */}
          <div className="col-md-7 p-5 d-flex flex-column justify-content-center">
            <h3 className="mb-4 fw-bold text-white" style={{ letterSpacing: "-0.5px" }}>Create Account</h3>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert py-2 mb-4" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "10px", fontSize: "14px" }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" name="name" required className="form-control" placeholder="John Doe" value={formData.name} onChange={handleChange} style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 4px rgba(16, 185, 129, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"; e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.2)"; }} />
                </div>
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>Phone Number</label>
                  <input type="tel" name="phone" required className="form-control" placeholder="+1 234 567 890" value={formData.phone} onChange={handleChange} style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 4px rgba(16, 185, 129, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"; e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.2)"; }} />
                </div>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>Email Address</label>
                <input type="email" name="email" required className="form-control" placeholder="john@example.com" value={formData.email} onChange={handleChange} style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 4px rgba(16, 185, 129, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"; e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.2)"; }} />
              </div>

              <div className="mb-3">
                <label style={labelStyle}>Username</label>
                <input type="text" name="username" required className="form-control" placeholder="Choose a unique username" value={formData.username} onChange={handleChange} style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 4px rgba(16, 185, 129, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"; e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.2)"; }} />
              </div>

              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label style={labelStyle}>Password</label>
                  <input type="password" name="passkey" required className="form-control" placeholder="••••••••" value={formData.passkey} onChange={handleChange} style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 4px rgba(16, 185, 129, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"; e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.2)"; }} />
                </div>
                <div className="col-md-6">
                  <label style={labelStyle}>Confirm Password</label>
                  <input type="password" name="confirmPassword" required className="form-control" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 4px rgba(16, 185, 129, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"; e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.2)"; }} />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn w-100 fw-semibold mb-4"
                disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#fff",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                  fontSize: "16px"
                }}
              >
                {loading ? "Creating Account..." : "Join E-Wallet Pro"}
              </motion.button>

              <div className="text-center">
                <small style={{ color: "#94a3b8", fontSize: "14px" }}>
                  Already have an account?{" "}
                  <Link to="/" style={{ color: "#34d399", textDecoration: "none", fontWeight: "600" }}>Sign In</Link>
                </small>
              </div>
            </form>
          </div>

          {/* RIGHT SIDE (GRADIENT INFO PANEL) */}
          <div
            className="col-md-5 d-none d-md-flex flex-column justify-content-center align-items-center text-white p-5"
            style={{
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.8), rgba(5, 150, 105, 0.8))",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", top: "-50px", left: "-50px", width: "200px", height: "200px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(20px)" }}></div>
            <div style={{ position: "absolute", bottom: "-50px", right: "-50px", width: "200px", height: "200px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(20px)" }}></div>
            
            <h2 className="fw-bold mb-4" style={{ fontSize: "2.5rem", letterSpacing: "-1px", zIndex: 1 }}>Welcome 🎉</h2>
            <p className="text-center mb-5" style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem", lineHeight: "1.6", zIndex: 1 }}>
              Start managing your wallet securely and seamlessly. Join thousands of users today.
            </p>

            <div className="d-flex flex-column gap-3 w-100" style={{ zIndex: 1 }}>
              <div className="p-3" style={{ background: "rgba(255,255,255,0.1)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "20px", marginRight: "12px" }}>🔐</span>
                <span className="fw-semibold">Bank-grade Security</span>
              </div>
              <div className="p-3" style={{ background: "rgba(255,255,255,0.1)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "20px", marginRight: "12px" }}>⚡</span>
                <span className="fw-semibold">Lightning Fast Transfers</span>
              </div>
              <div className="p-3" style={{ background: "rgba(255,255,255,0.1)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "20px", marginRight: "12px" }}>📊</span>
                <span className="fw-semibold">Smart Expense Tracking</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;
