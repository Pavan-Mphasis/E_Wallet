import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          passkey: password
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Invalid admin username or password");
        setLoading(false);
        return;
      }

      if ((data.role || "USER") !== "ADMIN") {
        localStorage.clear();
        setMessage("This account does not have admin access");
        setLoading(false);
        return;
      }

      localStorage.setItem("username", username);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", "ADMIN");

      if (data.mfaRequired) {
        localStorage.setItem("mfaEnabled", "true");
        localStorage.setItem("tempToken", data.tempToken);
        localStorage.setItem("tempRole", "ADMIN");
        navigate("/mfa");
      } else {
        localStorage.setItem("mfaEnabled", "false");
        localStorage.setItem("token", data.token);
        localStorage.removeItem("tempToken");
        localStorage.removeItem("tempRole");
        navigate("/admin/users");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #111827 0%, #1d4ed8 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "24px",
          padding: "40px",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.45)"
        }}
      >
        <div className="text-center mb-4">
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 20px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "28px",
              fontWeight: "700"
            }}
          >
            A
          </div>
          <h2 className="fw-bold text-white mb-2">Admin Access</h2>
          <p style={{ color: "#cbd5e1", margin: 0 }}>
            Sign in with an admin account to view all users.
          </p>
        </div>

        {message && (
          <div
            className="mb-4 p-3 text-center"
            style={{
              background: "rgba(239, 68, 68, 0.12)",
              color: "#fca5a5",
              borderRadius: "12px",
              border: "1px solid rgba(239, 68, 68, 0.2)"
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#cbd5e1" }}>
              Admin Username
            </label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
                borderRadius: "12px",
                padding: "14px 16px"
              }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label" style={{ color: "#cbd5e1" }}>
              Password
            </label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
                borderRadius: "12px",
                padding: "14px 16px"
              }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn w-100 fw-semibold mb-3"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              color: "white",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 10px 30px rgba(245, 158, 11, 0.25)"
            }}
          >
            {loading ? "Checking..." : "Sign In as Admin"}
          </motion.button>
        </form>

        <div className="text-center">
          <small style={{ color: "#cbd5e1" }}>
            Standard user?{" "}
            <Link to="/" style={{ color: "#bfdbfe", textDecoration: "none", fontWeight: "600" }}>
              Go to user login
            </Link>
          </small>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
