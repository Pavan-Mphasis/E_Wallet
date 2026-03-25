import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function AddMoney() {

  const [amount, setAmount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
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
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) return;

      const data = await res.json();
      setAccounts(data);

    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAccount) {
      setMessage("Please select a bank account");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/wallet/add-from-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          accountId: selectedAccount,
          amount: Number(amount)
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Added ₹${amount} from bank. Wallet: ₹${data.walletBalance}`);
        setAmount("");

        setTimeout(() => navigate("/dashboard"), 2000);

      } else {
        setMessage(data.message || "Failed");
      }

    } catch (err) {
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
        justifyContent: "center"
      }}
    >

      <div
        style={{
          width: "500px",
          background: "#fff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.15)"
        }}
      >

        <div className="d-flex justify-content-between mb-3">
          <h4 className="fw-bold">Add Money</h4>
          <Link to="/dashboard" className="btn btn-sm btn-outline-dark">
            Back
          </Link>
        </div>

        <form onSubmit={handleSubmit}>

          {/* SELECT ACCOUNT */}
          <div className="mb-3">
            <label className="form-label">Select Bank Account</label>

            <select
              className="form-select"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              required
            >
              <option value="">-- Select Account --</option>

              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.bankName} (**** {acc.cardNumber?.slice(-4)}) - ₹{acc.balance}
                </option>
              ))}

            </select>
          </div>

          {/* AMOUNT */}
          <div className="mb-3">
            <label className="form-label">Amount</label>

            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-dark w-100 rounded-pill">
            Add to Wallet
          </button>

        </form>

        {message && (
          <div className="alert alert-info mt-3 text-center">
            {message}
          </div>
        )}

      </div>

    </div>
  );
}

export default AddMoney;