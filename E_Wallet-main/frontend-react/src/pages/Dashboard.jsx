import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/wallet/balance", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setBalance(data.balance))
      .catch((err) => console.error(err));

    fetch("http://localhost:8080/auth/mfa-status", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setMfaEnabled(data.enabled))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleDisableMFA = async () => {
    if (!window.confirm("Are you sure you want to disable MFA?")) return;
    const token = localStorage.getItem("token");
    try {
      await fetch("http://localhost:8080/auth/disable-mfa", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
      });
      setMfaEnabled(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        padding: "40px",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <div className="container" style={{ maxWidth: "1100px" }}>
        
        {/* NAVBAR */}
        <nav
          className="d-flex justify-content-between align-items-center px-4 py-3 mb-4"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}
        >
          <div className="d-flex align-items-center">
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #3b82f6, #0ea5e9)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "15px",
                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)"
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <h5 className="fw-bold m-0 text-white" style={{ letterSpacing: "-0.5px" }}>E-Wallet Pro</h5>
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link to="/profile" className="btn text-white px-3 fw-semibold" style={{ background: "rgba(255,255,255,0.1)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <i className="bi bi-person me-2"></i>Profile
            </Link>
            <button onClick={handleLogout} className="btn px-3 fw-semibold" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#fca5a5", borderRadius: "10px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
              Logout
            </button>
          </div>
        </nav>

        {/* MAIN PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "24px",
            padding: "40px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          {/* HEADER */}
          <div className="mb-5">
            <h2 className="fw-bold mb-1 text-white" style={{ letterSpacing: "-0.5px" }}>Dashboard</h2>
            <p style={{ color: "#94a3b8" }}>Overview of your account health and recent activities.</p>
          </div>

          <div className="row g-4 mb-5">
            {/* BALANCE CARD */}
            <div className="col-lg-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  height: "100%",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  padding: "35px",
                  color: "white",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "150px", height: "150px", background: "rgba(16, 185, 129, 0.2)", borderRadius: "50%", filter: "blur(30px)" }}></div>
                
                <p className="mb-2 fw-semibold" style={{ color: "#6ee7b7", letterSpacing: "1px", textTransform: "uppercase", fontSize: "13px" }}>Total Available Balance</p>
                <h1 className="fw-bold mb-4" style={{ fontSize: "3.5rem", letterSpacing: "-1px" }}>
                  ₹{Number(balance).toLocaleString()}
                </h1>

                <div className="d-flex flex-wrap gap-3 mt-4">
                  <Link to="/addmoney" className="btn fw-semibold" style={{ background: "#10b981", color: "white", borderRadius: "12px", padding: "10px 24px", boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)" }}>
                    Add Funds
                  </Link>
                  <Link to="/transfer" className="btn fw-semibold" style={{ background: "rgba(255,255,255,0.1)", color: "white", borderRadius: "12px", padding: "10px 24px", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}>
                    Transfer Money
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* SECURITY/MFA CARD */}
            <div className="col-lg-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  height: "100%",
                  borderRadius: "20px",
                  background: "rgba(0, 0, 0, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  padding: "30px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div className="d-flex align-items-center mb-3">
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: mfaEnabled ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "12px" }}>
                      {mfaEnabled ? <span className="fs-5">🛡️</span> : <span className="fs-5">⚠️</span>}
                    </div>
                    <h5 className="fw-bold text-white m-0">Security</h5>
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>
                    {mfaEnabled ? "Your account is highly secure with Two-Factor Authentication." : "Your account is missing 2FA protection. Enable it now."}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="d-flex justify-content-between mb-3 text-white" style={{ fontSize: "14px", fontWeight: "500" }}>
                    <span>2FA Status</span>
                    <span style={{ color: mfaEnabled ? "#34d399" : "#fbbf24" }}>{mfaEnabled ? "Enabled" : "Disabled"}</span>
                  </div>
                  {mfaEnabled ? (
                    <button onClick={handleDisableMFA} className="btn w-100 fw-semibold" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171", borderRadius: "10px", padding: "10px" }}>
                      Disable MFA
                    </button>
                  ) : (
                    <Link to="/mfa-setup" className="btn w-100 fw-semibold" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none", color: "white", borderRadius: "10px", boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)", padding: "10px" }}>
                      Setup Protection
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <h5 className="fw-bold text-white mb-4">Quick Links</h5>
          <motion.div
            className="row g-4"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {cards.map((card, index) => (
              <div className="col-md-3 col-sm-6" key={index}>
                <Link to={card.link} className="text-decoration-none">
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -5, background: "rgba(255, 255, 255, 0.08)" }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "16px",
                      padding: "24px 20px",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      transition: "background 0.3s ease",
                      height: "100%"
                    }}
                  >
                    <div style={{ width: "45px", height: "45px", borderRadius: "12px", background: card.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "white", fontSize: "20px" }}>
                      {card.icon}
                    </div>
                    <h6 className="fw-semibold text-white mb-1">{card.title}</h6>
                    <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>{card.desc}</p>
                  </motion.div>
                </Link>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

const cards = [
  { title: "Deposit", desc: "Top up your balance", link: "/addmoney", icon: "💰", color: "linear-gradient(135deg, #10b981, #059669)" },
  { title: "Transfer", desc: "Send to contacts", link: "/transfer", icon: "💸", color: "linear-gradient(135deg, #3b82f6, #2563eb)" },
  { title: "History", desc: "View all activity", link: "/transactions", icon: "📋", color: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
  { title: "Accounts", desc: "Linked bank cards", link: "/accounts", icon: "💳", color: "linear-gradient(135deg, #f59e0b, #d97706)" }
];

export default Dashboard;