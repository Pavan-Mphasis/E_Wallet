import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Transfer() {
  const [mode, setMode] = useState("self"); // self | peer
  const [accounts, setAccounts] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWalletBalance, setLoadingWalletBalance] = useState(true);

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
  const currentUsername = localStorage.getItem("username") || "";

  useEffect(() => {
    if (!token || !userId || userId === "undefined") {
      localStorage.clear();
      navigate("/");
      return;
    }

    fetchAccounts();
    fetchWalletBalance();
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

  const fetchWalletBalance = async () => {
    try {
      const res = await fetch("http://localhost:8081/wallet/balance", {
        headers: { Authorization: "Bearer " + token }
      });
      if (!res.ok) {
        throw new Error(`Failed to load wallet balance (${res.status})`);
      }
      const data = await res.json();
      setWalletBalance(Number(data.balance || 0));
    } catch (err) {
      console.error(err);
      setMessage((current) => current || "Unable to load wallet balance.");
    } finally {
      setLoadingWalletBalance(false);
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
        setMessage("Transfer successful");
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

    const trimmedReceiverUsername = receiverUsername.trim();
    const numericAmount = Number(amount);

    if (!trimmedReceiverUsername) {
      setMessage("Enter the recipient username");
      return;
    }

    if (trimmedReceiverUsername === currentUsername) {
      setMessage("Cannot send money to your own account");
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      setMessage("Enter a valid amount");
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/wallet/transfer/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          receiverUsername: trimmedReceiverUsername,
          amount: numericAmount
        })
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`Payment sent to @${data.receiverUsername}. Transaction #${data.transactionId}`);
        setWalletBalance(Number(data.remainingWalletBalance || 0));
        setAmount("");
        setReceiverUsername("");
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

  const labelStyle = {
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "6px",
    display: "block"
  };

  const isSuccessMessage =
    message.toLowerCase().includes("payment sent") ||
    message.toLowerCase().includes("transfer successful");

  return (
    <div style={{ padding: "40px 20px", display: "flex", justifyContent: "center" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <div className="mb-4 text-center">
          <h3 className="fw-bold mb-0 text-white" style={{ letterSpacing: "-0.5px" }}>
            Transfer
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
            Send money or move funds between your accounts
          </p>
        </div>

        <div
          className="d-flex mb-4 p-1"
          style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.05)"
          }}
        >
          <button
            className="btn w-50 fw-semibold"
            style={{
              background: mode === "peer" ? "rgba(255,255,255,0.1)" : "transparent",
              color: mode === "peer" ? "#fff" : "#94a3b8",
              borderRadius: "10px",
              border: "none",
              transition: "all 0.3s"
            }}
            onClick={() => {
              setMode("peer");
              setMessage("");
            }}
          >
            Send to User
          </button>
          <button
            className="btn w-50 fw-semibold"
            style={{
              background: mode === "self" ? "rgba(255,255,255,0.1)" : "transparent",
              color: mode === "self" ? "#fff" : "#94a3b8",
              borderRadius: "10px",
              border: "none",
              transition: "all 0.3s"
            }}
            onClick={() => {
              setMode("self");
              setMessage("");
            }}
          >
            Self Transfer
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "peer" && (
            <motion.form
              key="peer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handlePeerTransfer}
            >
              <div
                className="mb-4 p-3"
                style={{
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.06)"
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>
                    Wallet Balance
                  </span>
                  <span className="fw-bold text-white">
                    {loadingWalletBalance ? "Loading..." : `Rs ${walletBalance.toLocaleString()}`}
                  </span>
                </div>
                <small style={{ color: "#94a3b8", fontSize: "12px", lineHeight: "1.5" }}>
                  Payments are sent from your wallet to another user&apos;s wallet and recorded in the transactions table.
                </small>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>Recipient Username</label>
                <div className="input-group">
                  <span
                    className="input-group-text"
                    style={{
                      background: "rgba(0,0,0,0.2)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRight: "none",
                      color: "#94a3b8"
                    }}
                  >
                    @
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="username"
                    value={receiverUsername}
                    onChange={(e) => setReceiverUsername(e.target.value)}
                    required
                    style={{
                      ...inputStyle,
                      borderLeft: "none",
                      borderTopLeftRadius: "0",
                      borderBottomLeftRadius: "0"
                    }}
                  />
                </div>
                <small style={{ color: "#94a3b8", fontSize: "12px" }}>
                  Enter the exact username of the recipient.
                </small>
              </div>

              <div className="mb-4">
                <label style={labelStyle}>Amount</label>
                <div className="input-group">
                  <span
                    className="input-group-text"
                    style={{
                      background: "rgba(0,0,0,0.2)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRight: "none",
                      color: "#94a3b8"
                    }}
                  >
                    Rs
                  </span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="form-control"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    style={{
                      ...inputStyle,
                      borderLeft: "none",
                      borderTopLeftRadius: "0",
                      borderBottomLeftRadius: "0",
                      fontSize: "20px",
                      fontWeight: "bold",
                      letterSpacing: "1px"
                    }}
                  />
                </div>

                <div className="d-flex gap-2 mt-3">
                  {[500, 1000, 5000].map((presetAmount) => (
                    <button
                      key={presetAmount}
                      type="button"
                      onClick={() => setAmount(String(presetAmount))}
                      className="btn btn-sm flex-grow-1 fw-semibold"
                      style={{
                        background:
                          Number(amount) === presetAmount
                            ? "rgba(139, 92, 246, 0.2)"
                            : "rgba(255,255,255,0.05)",
                        color: Number(amount) === presetAmount ? "#c4b5fd" : "#94a3b8",
                        border:
                          Number(amount) === presetAmount
                            ? "1px solid rgba(139, 92, 246, 0.5)"
                            : "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        padding: "8px",
                        transition: "all 0.2s ease"
                      }}
                    >
                      +Rs {presetAmount}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn w-100 fw-semibold mb-3"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                  color: "#fff",
                  padding: "16px",
                  borderRadius: "14px",
                  border: "none",
                  boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)",
                  fontSize: "16px"
                }}
              >
                Send Secure Payment
              </motion.button>
            </motion.form>
          )}

          {mode === "self" && (
            <motion.form
              key="self"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSelfTransfer}
            >
              <div className="mb-3">
                <label style={labelStyle}>From Account</label>
                <select
                  className="form-select"
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 6l4 4 4-4'/%3e%3c/svg%3e\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "16px 12px"
                  }}
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  required
                >
                  <option value="" style={{ color: "#000" }}>
                    Select account
                  </option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id} style={{ color: "#000" }}>
                      {acc.bankName} - **** {acc.cardNumber?.slice(-4)} - Rs {Number(acc.balance).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>To Account</label>
                <select
                  className="form-select"
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 6l4 4 4-4'/%3e%3c/svg%3e\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "16px 12px"
                  }}
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                  required
                >
                  <option value="" style={{ color: "#000" }}>
                    Select account
                  </option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id} style={{ color: "#000" }}>
                      {acc.bankName} - **** {acc.cardNumber?.slice(-4)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label style={labelStyle}>Amount</label>
                <div className="input-group">
                  <span
                    className="input-group-text"
                    style={{
                      background: "rgba(0,0,0,0.2)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRight: "none",
                      color: "#94a3b8"
                    }}
                  >
                    Rs
                  </span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="form-control"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    style={{
                      ...inputStyle,
                      borderLeft: "none",
                      borderTopLeftRadius: "0",
                      borderBottomLeftRadius: "0"
                    }}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn w-100 fw-semibold mb-3"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: "#fff",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
                  fontSize: "16px"
                }}
              >
                Transfer Now
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 text-center mt-3"
            style={{
              background: isSuccessMessage ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
              color: isSuccessMessage ? "#34d399" : "#f87171",
              border: `1px solid ${
                isSuccessMessage ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"
              }`,
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            {message}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Transfer;
