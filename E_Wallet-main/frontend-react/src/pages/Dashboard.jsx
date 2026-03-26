import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId || userId === "undefined") {
      localStorage.clear();
      navigate("/");
      return;
    }

    fetch("http://localhost:8081/wallet/balance", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setBalance(data.balance))
      .catch((err) => console.error(err));

    fetch("http://localhost:8081/auth/mfa-status", {
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
      await fetch("http://localhost:8081/auth/disable-mfa", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
      });
      setMfaEnabled(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "40px 40px" }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
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
            <h2 className="fw-bold mb-1 text-white" style={{ letterSpacing: "-0.5px" }}>
              Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}, {localStorage.getItem("username") || "User"}! 👋
            </h2>
            <p style={{ color: "#94a3b8" }}>Overview of your account health and recent activities.</p>
          </div>

          <div className="row g-4 mb-5">
            {/* VIRTUAL CREDIT CARD & ACTIONS */}
            <div className="col-lg-7">
              <motion.div
                initial={{ opacity: 0, rotateY: -15, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                style={{
                  height: "auto",
                  minHeight: "240px",
                  borderRadius: "24px",
                  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "35px",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.2)"
                }}
              >
                {/* Holographic Gloss Effect */}
                <div style={{ position: "absolute", top: "-100px", left: "-50px", width: "250px", height: "250px", background: "linear-gradient(135deg, rgba(255,255,255,0.15), transparent)", borderRadius: "50%", filter: "blur(30px)", transform: "rotate(45deg)", pointerEvents: "none" }}></div>
                <div style={{ position: "absolute", bottom: "-80px", right: "-20px", width: "200px", height: "200px", background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), transparent)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }}></div>
                
                {/* Chip & Wireless */}
                <div className="d-flex justify-content-between align-items-center mb-4" style={{ position: "relative", zIndex: 2 }}>
                  <svg width="45" height="32" viewBox="0 0 45 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="45" height="32" rx="6" fill="#fbbf24"/>
                    <path d="M12 0V32M33 0V32M0 12H45M0 20H45" stroke="#d97706" strokeWidth="1.5"/>
                  </svg>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V2l-2 2-2-2-2 2-2-2-2 2-2-2-2 2Z"></path>
                    <path d="M16 14v.01"></path>
                    <path d="M8 14v.01"></path>
                    <path d="M12 10v.01"></path>
                  </svg>
                </div>

                <div style={{ position: "relative", zIndex: 2, marginBottom: "30px" }}>
                  <p className="mb-0" style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px" }}>Available Balance</p>
                  <h1 className="fw-bold m-0" style={{ fontSize: "3.5rem", letterSpacing: "-1px", fontFamily: "'Courier New', Courier, monospace", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                    ₹{Number(balance).toLocaleString()}
                  </h1>
                </div>

                <div className="d-flex justify-content-between align-items-end" style={{ position: "relative", zIndex: 2 }}>
                  <div>
                    <p className="mb-0" style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Card Holder</p>
                    <p className="mb-0 fw-semibold" style={{ fontSize: "16px", letterSpacing: "2px", textTransform: "uppercase" }}>{localStorage.getItem("username") || "Valued User"}</p>
                  </div>
                  <div style={{ fontStyle: "italic", fontWeight: "900", fontSize: "24px", color: "rgba(255,255,255,0.9)", letterSpacing: "-1px" }}>E-Wallet<span style={{color: "#3b82f6"}}>Pro</span></div>
                </div>
              </motion.div>

              <div className="d-flex gap-3 mt-4">
                <Link to="/addmoney" className="btn fw-semibold flex-grow-1" style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", borderRadius: "16px", padding: "14px", boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)" }}>
                  <i className="bi bi-wallet2 me-2"></i> Add Funds
                </Link>
                <Link to="/transfer" className="btn fw-semibold flex-grow-1" style={{ background: "rgba(255,255,255,0.05)", color: "white", borderRadius: "16px", padding: "14px", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                  <i className="bi bi-send-fill me-2"></i> Transfer Money
                </Link>
              </div>
            </div>

            {/* SECURITY/MFA CARD & SPARKLINE */}
            <div className="col-lg-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  borderRadius: "24px",
                  background: "rgba(0, 0, 0, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  padding: "30px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  marginBottom: "20px"
                }}
              >
                <div>
                  <div className="d-flex align-items-center mb-3">
                    <div style={{ width: "45px", height: "45px", borderRadius: "12px", background: mfaEnabled ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "16px", boxShadow: mfaEnabled ? "0 0 15px rgba(16, 185, 129, 0.2)" : "0 0 15px rgba(245, 158, 11, 0.2)" }}>
                      {mfaEnabled ? <span className="fs-5">🛡️</span> : <span className="fs-5">⚠️</span>}
                    </div>
                    <div>
                      <h5 className="fw-bold text-white m-0" style={{ letterSpacing: "-0.5px" }}>Global Security</h5>
                      <span style={{ fontSize: "12px", color: mfaEnabled ? "#34d399" : "#fbbf24" }}>{mfaEnabled ? "Active & Protected" : "Vulnerable"}</span>
                    </div>
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>
                    {mfaEnabled ? "Your payments are tightly secured with Two-Factor Authentication." : "Your account is missing 2FA protection. Enable it now to prevent unauthorized transfers."}
                  </p>
                </div>

                <div className="mt-2">
                  {mfaEnabled ? (
                    <button onClick={handleDisableMFA} className="btn w-100 fw-semibold" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171", borderRadius: "14px", padding: "12px", transition: "all 0.3s" }}>
                      Disable MFA
                    </button>
                  ) : (
                    <Link to="/mfa-setup" className="btn w-100 fw-semibold" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none", color: "white", borderRadius: "14px", boxShadow: "0 8px 20px rgba(245, 158, 11, 0.3)", padding: "12px", transition: "all 0.3s" }}>
                      Setup Protection
                    </Link>
                  )}
                </div>
              </motion.div>

              {/* SPARKLINE CHART MOCK */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  borderRadius: "24px",
                  background: "linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(0,0,0,0.2) 100%)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  padding: "30px",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-4 text-white">
                  <h6 className="fw-semibold m-0">Weekly Activity</h6>
                  <span style={{ fontSize: "12px", color: "#60a5fa", background: "rgba(59, 130, 246, 0.2)", padding: "4px 10px", borderRadius: "10px" }}>+12.5%</span>
                </div>
                
                <svg viewBox="0 0 200 60" style={{ width: "100%", height: "60px", overflow: "visible" }}>
                  <defs>
                    <linearGradient id="gradientPath" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                    </linearGradient>
                  </defs>
                  
                  <path d="M0 50 Q 20 40, 40 45 T 80 20 T 120 30 T 160 10 T 200 15 L 200 60 L 0 60 Z" fill="url(#gradientPath)" />
                  <path d="M0 50 Q 20 40, 40 45 T 80 20 T 120 30 T 160 10 T 200 15" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="160" cy="10" r="4" fill="#60a5fa" stroke="#fff" strokeWidth="2" />
                </svg>
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
