import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !userId || userId === "undefined") {
      localStorage.clear();
      navigate("/");
      return;
    }
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/transactions", {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      } else {
        setMessage("Failed to load transactions.");
      }
    } catch (error) {
      setMessage("Server error or backend unreachable.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleString();

  const getDirectionInfo = (t) => {
    if (t.sender === null) return { text: "Added", icon: "arrow-down-right", color: "#10b981" };
    if (t.sender == userId) return { text: "Sent", icon: "arrow-up-right", color: "#ef4444" };
    return { text: "Received", icon: "arrow-down-left", color: "#10b981" };
  };

  const getStatusBadge = (status) => {
    if (status === "SUCCESS") return { bg: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "rgba(16, 185, 129, 0.3)" };
    if (status === "FAILED") return { bg: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "rgba(239, 68, 68, 0.3)" };
    return { bg: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "rgba(245, 158, 11, 0.3)" };
  };

  return (
    <div style={{ padding: "40px 40px" }}>
      <div className="container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <div className="mb-5">
          <h2 className="fw-bold mb-1 text-white" style={{ letterSpacing: "-0.5px" }}>Transaction History</h2>
          <p style={{ color: "#94a3b8", margin: 0 }}>View all your recent deposits and transfers.</p>
        </div>

        {/* MAIN PANEL */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-100" style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderRadius: "24px", padding: "30px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          
          {loading ? (
            <div className="text-center py-5 text-white">
              <div className="spinner-border mb-3" style={{ color: "#3b82f6" }} role="status"></div>
              <p>Loading history...</p>
            </div>
          ) : message ? (
            <div className="text-center py-5">
              <div className="alert mx-auto" style={{ maxWidth: "400px", background: "rgba(239, 68, 68, 0.1)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "12px" }}>
                {message}
              </div>
            </div>
          ) : transactions.length > 0 ? (
            <div className="transaction-list">
              {Object.entries(
                transactions.reduce((acc, t) => {
                  const date = new Date(t.dateTime).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
                  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
                  const key = date === today ? "Today" : date;
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(t);
                  return acc;
                }, {})
              ).map(([dateGroup, items]) => (
                <div key={dateGroup} className="mb-4">
                  <h6 className="fw-semibold mb-3" style={{ color: "#94a3b8", textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "10px" }}>
                    {dateGroup}
                  </h6>
                  
                  <div className="d-flex flex-column gap-2">
                    {items.map((t, index) => {
                      const dirInfo = getDirectionInfo(t);
                      const statusInfo = getStatusBadge(t.status);
                      
                      let bgGradient = "linear-gradient(135deg, #10b981, #059669)";
                      let iconClass = "bi-bank2";
                      let initials = "B";

                      if (dirInfo.text === "Sent") {
                        bgGradient = "linear-gradient(135deg, #8b5cf6, #6d28d9)";
                        iconClass = "bi-send-fill";
                        initials = t.receiver ? String(t.receiver).charAt(0).toUpperCase() : "S";
                      } else if (dirInfo.text === "Received") {
                        bgGradient = "linear-gradient(135deg, #3b82f6, #2563eb)";
                        iconClass = "bi-box-arrow-in-down-left";
                        initials = t.sender ? String(t.sender).charAt(0).toUpperCase() : "R";
                      }
                      
                      return (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ delay: index * 0.05 }} 
                          whileHover={{ background: "rgba(255,255,255,0.05)", scale: 1.01 }}
                          style={{ background: "rgba(0,0,0,0.2)", borderRadius: "16px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(255,255,255,0.02)", cursor: "default", transition: "all 0.2s" }}
                        >
                          <div className="d-flex align-items-center">
                            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: bgGradient, display: "flex", alignItems: "center", justifyContent: "center", marginRight: "16px", color: "white", fontSize: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
                              {initials}
                            </div>
                            <div>
                              <p className="mb-0 fw-bold text-white fs-6">{t.type}</p>
                              <div className="d-flex align-items-center gap-2 mt-1">
                                <small style={{ color: "#94a3b8", fontSize: "13px" }}>{dirInfo.text === "Sent" ? `To User ID: ${t.receiver}` : dirInfo.text === "Received" ? `From User ID: ${t.sender}` : dirInfo.text}</small>
                                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#475569" }}></span>
                                <small style={{ color: "#64748b", fontSize: "12px" }}>{new Date(t.dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</small>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-end">
                            <div className="fw-bold mb-1" style={{ color: dirInfo.text === "Sent" ? "white" : "#34d399", fontSize: "18px", letterSpacing: "-0.5px" }}>
                              {dirInfo.text === "Sent" ? "-" : "+"}₹{Number(t.amount).toLocaleString()}
                            </div>
                            <span className="px-2 py-1 fw-bold" style={{ fontSize: "10px", borderRadius: "8px", background: statusInfo.bg, color: statusInfo.color, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                              {t.status}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div style={{ fontSize: "50px", color: "rgba(255,255,255,0.1)", marginBottom: "15px" }}>📋</div>
              <h5 className="text-white fw-semibold">No Transactions Yet</h5>
              <p style={{ color: "#94a3b8" }}>Your activity will appear here once you make a transfer or deposit.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Transactions;
