import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Transfer() {
  const [mode, setMode] = useState("self"); // self | peer
  const [accounts, setAccounts] = useState([]);

  // Self transfer state
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");

  // Peer transfer state
  const [receiverUsername, setReceiverUsername] = useState("");

  // Shared state
  const [amount, setAmount] = useState("");
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
      const res = await fetch("http://localhost:8081/accounts", {
        headers: { Authorization: "Bearer " + token }
      });
      if (!res.ok) {
        throw new Error(`Failed to load accounts (${res.status})`);
      }
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      console.error(err);
      setMessage("Unable to load linked bank accounts.");
    }
  };

  const handleSelfTransfer = async (e) => {
    e.preventDefault();
    if (fromAccount === toAccount) {
      setMessage("Cannot transfer to same account");
      return;
    }
    try {
      const res = await fetch("http://localhost:8081/wallet/transfer/self", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          fromAccountId: fromAccount,
          toAccountId: toAccount,
          amount: Number(amount)
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Transfer successful");
        setAmount("");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Transfer failed");
      }
    } catch {
      setMessage("Server error");
    }
  };

  const handlePeerTransfer = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8081/wallet/transfer/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          receiverUsername,
          amount: Number(amount)
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Funds sent successfully to " + receiverUsername);
        setAmount("");
        setReceiverUsername("");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setMessage(data.message || "Transfer failed");
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
          <h3 className="fw-bold mb-0 text-white" style={{ letterSpacing: "-0.5px" }}>Transfer</h3>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>Send money or manage accounts</p>
        </div>

        {/* TOGGLE */}
        <div className="d-flex mb-4 p-1" style={{ background: "rgba(0,0,0,0.2)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <button className={`btn w-50 fw-semibold`} style={{ background: mode === "peer" ? "rgba(255,255,255,0.1)" : "transparent", color: mode === "peer" ? "#fff" : "#94a3b8", borderRadius: "10px", border: "none", transition: "all 0.3s" }} onClick={() => { setMode("peer"); setMessage(""); }}>
            Send to Peer
          </button>
          <button className={`btn w-50 fw-semibold`} style={{ background: mode === "self" ? "rgba(255,255,255,0.1)" : "transparent", color: mode === "self" ? "#fff" : "#94a3b8", borderRadius: "10px", border: "none", transition: "all 0.3s" }} onClick={() => { setMode("self"); setMessage(""); }}>
            Self Transfer
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* PEER TRANSFER FORM */}
          {mode === "peer" && (
            <motion.form key="peer" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handlePeerTransfer}>
              
              {/* VIRTUAL RECENT CONTACTS */}
              <div className="mb-4">
                <label style={labelStyle}>Quick Send</label>
                <div className="d-flex gap-3 overflow-auto pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                  {[
                    {name: "Alice", username: "alice_w", color: "#f43f5e"},
                    {name: "Bob", username: "bob_smith", color: "#3b82f6"},
                    {name: "Charlie", username: "charlie99", color: "#10b981"},
                    {name: "Diana", username: "diana_r", color: "#f59e0b"}
                  ].map((contact) => (
                    <motion.div 
                      key={contact.username}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setReceiverUsername(contact.username)}
                      className="d-flex flex-column align-items-center"
                      style={{ cursor: "pointer", minWidth: "60px" }}
                    >
                      <div 
                        style={{ 
                          width: "48px", height: "48px", borderRadius: "50%", 
                          background: contact.color, display: "flex", 
                          alignItems: "center", justifyContent: "center", 
                          color: "white", fontSize: "18px", fontWeight: "bold",
                          boxShadow: `0 4px 10px ${contact.color}40`,
                          border: receiverUsername === contact.username ? "2px solid white" : "2px solid transparent",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {contact.name.charAt(0)}
                      </div>
                      <small style={{ color: receiverUsername === contact.username ? "white" : "#94a3b8", fontSize: "11px", marginTop: "8px", fontWeight: receiverUsername === contact.username ? "600" : "400" }}>
                        {contact.name}
                      </small>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>Recipient Username</label>
                <div className="input-group">
                  <span className="input-group-text" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRight: "none", color: "#94a3b8" }}>@</span>
                  <input type="text" className="form-control" placeholder="username" value={receiverUsername} onChange={(e) => setReceiverUsername(e.target.value)} required style={{ ...inputStyle, borderLeft: "none", borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }} />
                </div>
              </div>

              <div className="mb-4">
                <label style={labelStyle}>Amount</label>
                <div className="input-group">
                  <span className="input-group-text" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRight: "none", color: "#94a3b8" }}>₹</span>
                  <input type="number" className="form-control" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required style={{ ...inputStyle, borderLeft: "none", borderTopLeftRadius: "0", borderBottomLeftRadius: "0", fontSize: "20px", fontWeight: "bold", letterSpacing: "1px" }} />
                </div>
                
                <div className="d-flex gap-2 mt-3">
                  {[500, 1000, 5000].map((amt) => (
                    <button 
                      key={amt} type="button" 
                      onClick={() => setAmount(amt)}
                      className="btn btn-sm flex-grow-1 fw-semibold" 
                      style={{ 
                        background: Number(amount) === amt ? "rgba(139, 92, 246, 0.2)" : "rgba(255,255,255,0.05)", 
                        color: Number(amount) === amt ? "#c4b5fd" : "#94a3b8", 
                        border: Number(amount) === amt ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid rgba(255,255,255,0.1)", 
                        borderRadius: "8px", padding: "8px", transition: "all 0.2s ease" 
                      }}
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn w-100 fw-semibold mb-3" style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", color: "#fff", padding: "16px", borderRadius: "14px", border: "none", boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)", fontSize: "16px" }}>
                Send Secure Payment
              </motion.button>
            </motion.form>
          )}

          {/* SELF TRANSFER FORM */}
          {mode === "self" && (
            <motion.form key="self" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSelfTransfer}>
              <div className="mb-3">
                <label style={labelStyle}>From Account</label>
                <select className="form-select" style={{ ...inputStyle, cursor: "pointer", backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 6l4 4 4-4'/%3e%3c/svg%3e\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "16px 12px" }} value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} required>
                  <option value="" style={{ color: "#000" }}>Select account</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id} style={{ color: "#000" }}>
                      {acc.bankName} • **** {acc.cardNumber?.slice(-4)} • ₹{Number(acc.balance).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>To Account</label>
                <select className="form-select" style={{ ...inputStyle, cursor: "pointer", backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 6l4 4 4-4'/%3e%3c/svg%3e\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "16px 12px" }} value={toAccount} onChange={(e) => setToAccount(e.target.value)} required>
                  <option value="" style={{ color: "#000" }}>Select account</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id} style={{ color: "#000" }}>
                      {acc.bankName} • **** {acc.cardNumber?.slice(-4)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label style={labelStyle}>Amount</label>
                <div className="input-group">
                  <span className="input-group-text" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRight: "none", color: "#94a3b8" }}>₹</span>
                  <input type="number" className="form-control" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} required style={{ ...inputStyle, borderLeft: "none", borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }} />
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn w-100 fw-semibold mb-3" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", padding: "14px", borderRadius: "12px", border: "none", boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)", fontSize: "16px" }}>
                Transfer Now
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

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

export default Transfer;
