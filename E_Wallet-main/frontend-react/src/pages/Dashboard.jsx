import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔹 FETCH WALLET BALANCE
    fetch("http://localhost:8080/wallet/balance", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setBalance(data.balance))
      .catch((err) => console.error(err));

    // 🔹 FETCH MFA STATUS
    fetch("http://localhost:8080/auth/mfa-status", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("MFA STATUS:", data);
        setMfaEnabled(data.enabled);
      })
      .catch((err) => console.error(err));

  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleDisableMFA = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:8080/auth/disable-mfa", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setMfaEnabled(false); // update UI instantly

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #A28dd2, #FBC2EB)",
        padding: "40px"
      }}
    >

      {/* NAVBAR */}
      <nav
        className="d-flex justify-content-between align-items-center px-4 py-3 mb-4"
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px"
        }}
      >
        <h5 className="fw-bold m-0" style={{ color: "#111" }}>
          E-Wallet
        </h5>

        <div>
          <Link to="/profile" className="btn btn-outline-dark me-2 rounded-pill px-3">
            Profile
          </Link>

          <button onClick={handleLogout} className="btn btn-dark rounded-pill px-3">
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "#ffffff",
          borderRadius: "18px",
          padding: "40px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.12)"
        }}
      >

        {/* HEADER */}
        <div className="mb-5">
          <h2 className="fw-bold mb-1" style={{ color: "#111" }}>
            Dashboard
          </h2>
          <p className="text-muted">
            Manage your wallet and transactions
          </p>
        </div>

        {/* BALANCE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-5 p-4"
          style={{
            borderRadius: "14px",
            background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
            border: "1px solid #bbf7d0"
          }}
        >
          <p className="mb-1 text-muted">Wallet Balance</p>

          <h1 className="fw-bold" style={{ color: "#15803d" }}>
            ₹{balance}
          </h1>
        </motion.div>

        {/* QUICK ACTIONS */}
        <div className="mb-3">
          <h5 className="fw-semibold">Quick Actions</h5>
        </div>

        <motion.div
          className="row g-4 mb-5"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } }
          }}
        >

          {cards.map((card, index) => (
            <div className="col-md-4" key={index}>
              <Link to={card.link} className="text-decoration-none">

                <motion.div
                  variants={cardVariant}
                  whileHover={{
                    y: -6,
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)"
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={cardStyle}
                >
                  <h6 className="fw-semibold mb-2">{card.title}</h6>
                  <p className="text-muted small mb-0">{card.desc}</p>
                </motion.div>

              </Link>
            </div>
          ))}

        </motion.div>

        {/* ACCOUNT & SECURITY */}
        <div className="mb-3">
          <h5 className="fw-semibold">Account & Security</h5>
        </div>

        <div className="row g-4">

          {/* 🔐 MFA CARD (DYNAMIC) */}
          <div className="col-md-6">
            <motion.div
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.97 }}
              style={cardStyle}
            >
              <h6 className="fw-semibold mb-2">
                Multi-Factor Authentication
              </h6>

              <p className="text-muted small mb-3">
                {mfaEnabled
                  ? "Extra security is enabled"
                  : "Protect your account with 2FA"}
              </p>

              {mfaEnabled ? (
                <button
                  className="btn btn-danger w-100 rounded-pill"
                  onClick={handleDisableMFA}
                >
                  Disable MFA
                </button>
              ) : (
                <Link
                  to="/mfa-setup"
                  className="btn btn-success w-100 rounded-pill"
                >
                  Enable MFA
                </Link>
              )}
            </motion.div>
          </div>

          {/* BANK ACCOUNTS */}
          <div className="col-md-6">
            <Link to="/accounts" className="text-decoration-none">
              <motion.div
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                style={cardStyle}
              >
                <h6 className="fw-semibold mb-2">Bank Accounts</h6>
                <p className="text-muted small mb-0">
                  Manage linked cards
                </p>
              </motion.div>
            </Link>
          </div>

        </div>

      </motion.div>
    </div>
  );
}

/* 🔹 DATA */
const cards = [
  { title: "Add Money", desc: "Deposit funds into wallet", link: "/addmoney" },
  { title: "Transfer", desc: "Send money securely", link: "/transfer" },
  { title: "Transactions", desc: "View your history", link: "/transactions" }
];

/* 🔹 STYLE */
const cardStyle = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "20px",
  border: "1px solid #f1f5f9",
  cursor: "pointer"
};

/* 🔹 ANIMATION */
const cardVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default Dashboard;