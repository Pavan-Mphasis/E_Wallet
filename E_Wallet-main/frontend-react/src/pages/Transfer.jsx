import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Transfer() {

  const [mode, setMode] = useState("self"); // self | wallet
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch(`http://localhost:8080/accounts/${userId}`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const data = await res.json();
      setAccounts(data);

    } catch (err) {
      console.error(err);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (fromAccount === toAccount) {
      setMessage("Cannot transfer to same account");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/transfer/self", {
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
      } else {
        setMessage(data.message || "Transfer failed");
      }

    } catch {
      setMessage("Server error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #A28dd2, #FBC2EB)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px"
      }}
    >

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "500px",
          background: "#fff",
          borderRadius: "18px",
          padding: "30px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.15)"
        }}
      >

        {/* HEADER */}
        <div className="d-flex justify-content-between mb-3">
          <h4 className="fw-bold">Transfer</h4>
          <Link to="/dashboard" className="btn btn-outline-dark btn-sm">
            Back
          </Link>
        </div>

        {/* TOGGLE */}
        <div className="d-flex mb-4">
          <button
            className={`btn ${mode === "self" ? "btn-dark" : "btn-outline-dark"} w-50`}
            onClick={() => setMode("self")}
          >
            Self Transfer
          </button>

          <button
            className={`btn ${mode === "wallet" ? "btn-dark" : "btn-outline-dark"} w-50`}
            onClick={() => navigate("/addmoney")}
          >
            Add to Wallet
          </button>
        </div>

        {/* SELF TRANSFER FORM */}
        {mode === "self" && (
          <form onSubmit={handleTransfer}>

            {/* FROM */}
            <div className="mb-3">
              <label className="form-label fw-semibold">From Account</label>
              <select
                className="form-select"
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                required
              >
                <option value="">Select account</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.bankName} • **** {acc.cardNumber?.slice(-4)} • ₹{acc.balance}
                  </option>
                ))}
              </select>
            </div>

            {/* TO */}
            <div className="mb-3">
              <label className="form-label fw-semibold">To Account</label>
              <select
                className="form-select"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                required
              >
                <option value="">Select account</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.bankName} • **** {acc.cardNumber?.slice(-4)}
                  </option>
                ))}
              </select>
            </div>

            {/* AMOUNT */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Amount</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-dark w-100 rounded-pill">
              Transfer
            </button>

          </form>
        )}

        {/* MESSAGE */}
        {message && (
          <div className="alert alert-info mt-3 text-center">
            {message}
          </div>
        )}

      </motion.div>

    </div>
  );
}

export default Transfer;