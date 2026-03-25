import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Transactions() {

const [transactions, setTransactions] = useState([]);
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(true);

const userId = localStorage.getItem("userId");

useEffect(() => {
fetchTransactions();
}, []);

const fetchTransactions = async () => {
try {
const token = localStorage.getItem("token");


  const response = await fetch("http://localhost:8080/transactions/" + userId, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  if (response.ok) {
    const data = await response.json();
    setTransactions(data);
  } else {
    setMessage("Failed to load transactions");
  }

} catch (error) {
  setMessage("Server error");
} finally {
  setLoading(false);
}


};

const formatDate = (date) => {
return new Date(date).toLocaleString();
};

const getDirection = (t) => {
if (t.sender === null) return "Added";
if (t.sender == userId) return "Sent";
return "Received";
};

const getStatusBadge = (status) => {
if (status === "SUCCESS") return "badge bg-success";
if (status === "FAILED") return "badge bg-danger";
return "badge bg-warning text-dark";
};

return ( <div className="container mt-5">

  <div className="text-end mb-3">
    <Link to="/dashboard" className="btn btn-secondary">
      ← Back
    </Link>
  </div>

  <h2 className="text-center mb-4">Transaction History</h2>

  <div className="card p-4 shadow">

    {loading ? (
      <div className="text-center">Loading...</div>
    ) : (
      <table className="table table-bordered table-striped">

        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Direction</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {transactions.length > 0 ? (
            transactions.map((t, index) => (
              <tr key={index}>
                <td>{formatDate(t.dateTime)}</td>
                <td>{t.type}</td>
                <td>₹ {t.amount}</td>
                <td>{getDirection(t)}</td>
                <td>
                  <span className={getStatusBadge(t.status)}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>

      </table>
    )}

  </div>

  {message && (
    <div className="text-center mt-3">
      <div className="alert alert-danger">{message}</div>
    </div>
  )}

</div>

);
}

export default Transactions;
