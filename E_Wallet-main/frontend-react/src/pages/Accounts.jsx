import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

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
      const res = await fetch(`http://localhost:8081/accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(res.ok) {
        const data = await res.json();
        setAccounts(data);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to remove this account?")) return;
    await fetch(`http://localhost:8081/accounts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAccounts();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isNew = !form.id;
    const url = isNew ? "http://localhost:8081/accounts" : `http://localhost:8081/accounts/${form.id}`;
    const method = isNew ? "POST" : "PUT";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...form, balance: Number(form.balance || 0) })
    });

    setForm(null);
    fetchAccounts();
  };

  const inputStyle = {
    background: "rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#fff",
    borderRadius: "12px",
    padding: "12px 16px",
    transition: "all 0.3s ease",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
    width: "100%",
    marginBottom: "15px"
  };

  return (
    <div style={{ padding: "40px 40px" }}>
      <div className="container" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <div className="mb-5">
          <h2 className="fw-bold mb-1 text-white" style={{ letterSpacing: "-0.5px" }}>Linked Cards</h2>
          <p style={{ color: "#94a3b8", margin: 0 }}>Manage your linked cards and bank accounts</p>
        </div>

        {/* TOTAL BALANCE CARD */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-5 p-4 rounded-4" style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderRadius: "24px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="mb-1 fw-semibold text-uppercase" style={{ color: "#94a3b8", fontSize: "12px", letterSpacing: "1px" }}>Total Linked Balance</p>
              <h2 className="fw-bold text-white m-0" style={{ fontSize: "2.5rem" }}>₹{totalBalance.toLocaleString()}</h2>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setForm({ bankName: "", cardNumber: "", accountHolder: "", balance: "" })} className="btn px-4 py-3 fw-semibold text-white d-flex align-items-center" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", borderRadius: "14px", border: "none", boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)" }}>
              <i className="bi bi-plus-lg me-2"></i> Add Account
            </motion.button>
          </div>
        </motion.div>

        {/* CARDS LIST */}
        <div className="row g-4">
          <AnimatePresence>
            {accounts.map((acc, index) => {
              const bgGradients = [
                "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", // Obsidian
                "linear-gradient(135deg, #4c1d95 0%, #2e1065 100%)", // Deep Purple
                "linear-gradient(135deg, #1e3a8a 0%, #172554 100%)", // Navy Blue
                "linear-gradient(135deg, #064e3b 0%, #022c22 100%)", // Emerald
              ];
              const cardBg = bgGradients[index % bgGradients.length];

              return (
              <motion.div className="col-lg-4 col-md-6" key={acc.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.05 }}>
                <div className="p-4 text-white" style={{ borderRadius: "24px", background: cardBg, position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)" }}>
                  
                  {/* Holographic Gloss effect */}
                  <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "150px", height: "150px", background: "linear-gradient(135deg, rgba(255,255,255,0.15), transparent)", borderRadius: "50%", filter: "blur(20px)", transform: "rotate(45deg)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", bottom: "-30px", left: "-30px", width: "100px", height: "100px", background: "linear-gradient(135deg, rgba(255,255,255,0.05), transparent)", borderRadius: "50%", filter: "blur(20px)", pointerEvents: "none" }} />

                  <div className="d-flex justify-content-between align-items-center mb-3" style={{ position: "relative", zIndex: 2 }}>
                    <h5 className="fw-bold m-0" style={{ letterSpacing: "1px", textTransform: "uppercase", fontSize: "14px" }}>{acc.bankName}</h5>
                    {/* Simulated Mastercard circles */}
                    <div style={{ display: "flex", alignItems: "center", position: "relative", width: "36px", height: "22px" }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "rgba(239, 68, 68, 0.8)", position: "absolute", left: 0 }} />
                      <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "rgba(245, 158, 11, 0.8)", position: "absolute", right: 0, mixBlendMode: "screen" }} />
                    </div>
                  </div>

                  {/* Chip Icon */}
                  <div className="mb-3" style={{ position: "relative", zIndex: 2 }}>
                    <svg width="35" height="25" viewBox="0 0 45 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="45" height="32" rx="6" fill="#fbbf24"/>
                      <path d="M12 0V32M33 0V32M0 12H45M0 20H45" stroke="#d97706" strokeWidth="1.5"/>
                    </svg>
                  </div>

                  <h3 className="mb-4 fw-bold" style={{ letterSpacing: "3px", opacity: 0.9, fontFamily: "'Courier New', Courier, monospace", fontSize: "1.4rem", textShadow: "0 2px 5px rgba(0,0,0,0.5)", position: "relative", zIndex: 2 }}>
                    **** **** **** {acc.cardNumber?.slice(-4) || "0000"}
                  </h3>

                  <div className="d-flex justify-content-between mb-4" style={{ position: "relative", zIndex: 2 }}>
                    <div>
                      <small style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Card Holder</small>
                      <div className="fw-semibold" style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>{acc.accountHolder}</div>
                    </div>
                    <div className="text-end">
                      <small style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Balance</small>
                      <div className="fw-bold fs-5" style={{ color: "white" }}>₹{Number(acc.balance).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="d-flex gap-2" style={{ position: "relative", zIndex: 2, paddingTop: "15px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    <button className="btn btn-sm w-50 fw-semibold" style={{ background: "rgba(255,255,255,0.1)", color: "white", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }} onClick={() => setForm(acc)}>
                      Edit Account
                    </button>
                    <button className="btn btn-sm w-50 fw-semibold" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#fca5a5", borderRadius: "10px", border: "1px solid rgba(239, 68, 68, 0.2)", transition: "all 0.2s" }} onClick={() => handleDelete(acc.id)}>
                      Remove Data
                    </button>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </AnimatePresence>

          {accounts.length === 0 && (
            <div className="col-12">
              <div className="text-center py-5">
                <div style={{ fontSize: "50px", color: "rgba(255,255,255,0.1)", marginBottom: "15px" }}>💳</div>
                <h5 className="text-white fw-semibold">No Accounts Linked</h5>
                <p style={{ color: "#94a3b8" }}>Add a bank account to start adding funds to your wallet.</p>
              </div>
            </div>
          )}
        </div>

        {/* MODAL */}
        <AnimatePresence>
          {form && (
            <div className="modal d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.6)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050, backdropFilter: "blur(5px)" }}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="p-4" style={{ width: "100%", maxWidth: "450px", background: "#1e293b", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold text-white m-0">{form.id ? "Edit Card" : "Add Card"}</h4>
                  <button className="btn btn-sm" style={{ color: "#94a3b8", background: "rgba(255,255,255,0.1)", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", border: "none" }} onClick={() => setForm(null)}>×</button>
                </div>

                <form onSubmit={handleSave}>
                  <div>
                    <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>Bank Name</label>
                    <input className="form-control" placeholder="e.g. Chase Bank" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>Card Number</label>
                    <input className="form-control" placeholder="**** **** **** 1234" value={form.cardNumber} onChange={(e) => setForm({ ...form, cardNumber: e.target.value })} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>Account Holder</label>
                    <input className="form-control" placeholder="John Doe" value={form.accountHolder} onChange={(e) => setForm({ ...form, accountHolder: e.target.value })} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>Initial Balance</label>
                    <input type="number" className="form-control" placeholder="5000" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} style={inputStyle} required />
                  </div>

                  <button type="submit" className="btn w-100 fw-semibold text-white mt-2" style={{ background: "linear-gradient(135deg, #10b981, #059669)", padding: "12px", borderRadius: "12px", border: "none" }}>
                    {form.id ? "Save Changes" : "Link Account"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default Accounts;
