import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function AddMoney() {
  const [mode, setMode] = useState("add"); // add | withdraw
  const [amount, setAmount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token || !userId || userId === "undefined") {
      localStorage.clear();
      navigate("/");
      return;
    }
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch(`http://localhost:8081/accounts/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAccount) return setMessage("Please select a bank account");
    try {
      const res = await fetch("http://localhost:8081/wallet/add-from-account", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ accountId: selectedAccount, amount: Number(amount) })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Added ₹${amount} to wallet. Balance: ₹${data.walletBalance}`);
        setAmount("");
        setTimeout(() => navigate("/dashboard"), 3000);
      } else {
        setMessage(data.message || "Failed");
      }
    } catch {
      setMessage("Server error");
    }
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAccount) return setMessage("Please select a bank account");
    try {
      const res = await fetch("http://localhost:8081/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ accountId: selectedAccount, amount: Number(amount) })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Withdraw ₹${amount} successful. Remaining Wallet: ₹${data.walletBalance}`);
        setAmount("");
        setTimeout(() => navigate("/dashboard"), 3000);
      } else {
        setMessage(data.message || "Failed");
      }
    } catch {
      setMessage("Server error");
    }
  };

  const inputStyle = {
    background: "rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#fff",
    borderRadius: "12px",
    padding: "12px 16px",
    transition: "all 0.3s ease",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
    width: "100%"
  };

  const labelStyle = { color: "#cbd5e1", fontSize: "13px", fontWeight: "500", marginBottom: "6px", display: "block" };

  return (
    <div style={{ padding: "40px 20px", display: "flex", justifyContent: "center" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ width: "100%", maxWidth: "500px", background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderRadius: "24px", padding: "40px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
        
        {/* HEADER */}
        <div className="mb-4 text-center">
          <h3 className="fw-bold mb-0 text-white" style={{ letterSpacing: "-0.5px" }}>Wallet Funds</h3>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>Top up or withdraw</p>
        </div>

        {/* TOGGLE */}
        <div className="d-flex mb-4 p-1" style={{ background: "rgba(0,0,0,0.2)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <button className={`btn w-50 fw-semibold`} style={{ background: mode === "add" ? "rgba(255,255,255,0.1)" : "transparent", color: mode === "add" ? "#fff" : "#94a3b8", borderRadius: "10px", border: "none", transition: "all 0.3s" }} onClick={() => { setMode("add"); setMessage(""); }}>
            Top Up
          </button>
          <button className={`btn w-50 fw-semibold`} style={{ background: mode === "withdraw" ? "rgba(255,255,255,0.1)" : "transparent", color: mode === "withdraw" ? "#fff" : "#94a3b8", borderRadius: "10px", border: "none", transition: "all 0.3s" }} onClick={() => { setMode("withdraw"); setMessage(""); }}>
            Withdraw
          </button>
        </div>

        <form onSubmit={mode === "add" ? handleAddSubmit : handleWithdrawSubmit}>

          {/* SELECT ACCOUNT */}
          <div className="mb-4">
            <label style={labelStyle}>Select Bank Account</label>
            <select className="form-select" style={{ ...inputStyle, cursor: "pointer", backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 6l4 4 4-4'/%3e%3c/svg%3e\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "16px 12px" }} value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)} required>
              <option value="" style={{ color: "#000" }}>-- Select Account --</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id} style={{ color: "#000" }}>
                  {acc.bankName} (**** {acc.cardNumber?.slice(-4)}) - ₹{Number(acc.balance).toLocaleString()}
                </option>
              ))}
            </select>
            {accounts.length === 0 && (
              <small className="text-warning mt-2 d-block">
                <i className="bi bi-exclamation-triangle me-1"></i>No linked accounts. <Link to="/accounts" style={{ color: "#6ee7b7" }}>Add one here.</Link>
              </small>
            )}
          </div>

          {/* AMOUNT */}
          <div className="mb-4">
            <label style={labelStyle}>Amount</label>
            <div className="input-group">
              <span className="input-group-text" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRight: "none", color: "#94a3b8" }}>₹</span>
              <input type="number" className="form-control" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} required style={{ ...inputStyle, borderLeft: "none", borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }} />
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={accounts.length === 0} className="btn w-100 fw-semibold mb-3" style={{ background: accounts.length === 0 ? "rgba(255,255,255,0.1)" : (mode === "add" ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #f59e0b, #d97706)"), color: accounts.length === 0 ? "#94a3b8" : "#fff", padding: "14px", borderRadius: "12px", border: "none", boxShadow: accounts.length === 0 ? "none" : (mode === "add" ? "0 8px 20px rgba(16, 185, 129, 0.3)" : "0 8px 20px rgba(245, 158, 11, 0.3)"), fontSize: "16px" }}>
            {mode === "add" ? "Add Funds to Wallet" : "Withdraw to Bank"}
          </motion.button>
        </form>

        {/* MESSAGE */}
        {message && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 text-center mt-3" style={{ background: message.includes("✅") ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: message.includes("✅") ? "#34d399" : "#f87171", border: `1px solid ${message.includes("✅") ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`, borderRadius: "12px", fontSize: "14px", fontWeight: "500" }}>
            {message}
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}

export default AddMoney;
