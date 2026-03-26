import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          passkey: password
        })
      });

      if (!response.ok) {
        alert("Invalid username or password");
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!data.userId) {
        alert("Login error: userId missing from backend");
        setLoading(false);
        return;
      }

      localStorage.setItem("username", username);
      localStorage.setItem("userId", data.userId);

      if (data.mfaRequired) {
        localStorage.setItem("mfaEnabled", "true");
        localStorage.setItem("tempToken", data.tempToken);
        window.location.href = "/mfa";
      } else {
        localStorage.setItem("mfaEnabled", "false");
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      }

    } catch (err) {
      console.error(err);
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
      <div className="container" style={{ maxWidth: "900px" }}>
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
          {/* LEFT SIDE */}
          <div
            className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white p-5"
            style={{
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8))",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", top: "-50px", left: "-50px", width: "200px", height: "200px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(20px)" }}></div>
            <div style={{ position: "absolute", bottom: "-50px", right: "-50px", width: "200px", height: "200px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(20px)" }}></div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                transform: "rotate(10deg)"
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </motion.div>

            <h2 className="fw-bold mb-3" style={{ fontSize: "2.5rem", letterSpacing: "-1px", zIndex: 1 }}>E-Wallet Pro</h2>
            <p className="text-center px-3" style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem", lineHeight: "1.6", zIndex: 1 }}>
              The secure, fast, and remarkably beautiful way to manage your digital assets.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-md-6 p-5 d-flex flex-column justify-content-center">
            <h3 className="mb-4 fw-bold text-white text-center" style={{ letterSpacing: "-0.5px" }}>Welcome Back</h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label" style={{ color: "#cbd5e1", fontSize: "14px", fontWeight: "500" }}>Username</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e)=>setUsername(e.target.value)}
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#fff",
                    borderRadius: "12px",
                    padding: "14px 18px",
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

              <div className="mb-5">
                <label className="form-label" style={{ color: "#cbd5e1", fontSize: "14px", fontWeight: "500" }}>Password</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#fff",
                    borderRadius: "12px",
                    padding: "14px 18px",
                    transition: "all 0.3s ease",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#8b5cf6";
                    e.target.style.boxShadow = "0 0 0 4px rgba(139, 92, 246, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)";
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
                className="btn w-100 fw-semibold mb-4"
                disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                  color: "#fff",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 8px 20px rgba(139, 92, 246, 0.3)",
                  fontSize: "16px"
                }}
              >
                {loading ? "Authenticating..." : "Sign In"}
              </motion.button>

              <div className="text-center">
                <small style={{ color: "#94a3b8", fontSize: "14px" }}>
                  New here?{" "}
                  <Link to="/signup" style={{ color: "#60a5fa", textDecoration: "none", fontWeight: "600" }}>Create an account</Link>
                </small>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;