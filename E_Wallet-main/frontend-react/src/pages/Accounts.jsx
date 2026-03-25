import React, { useEffect, useState } from "react";

function Accounts() {

  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const res = await fetch(`http://localhost:8080/accounts/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setAccounts(data);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/accounts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAccounts();
  };

  const handleSave = async () => {
    const isNew = !form.id;

    const url = isNew
      ? "http://localhost:8080/accounts"
      : `http://localhost:8080/accounts/${form.id}`;

    const method = isNew ? "POST" : "PUT";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...form,
        userId: Number(userId)
      })
    });

    setForm(null);
    fetchAccounts();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      padding: "40px"
    }}>

      {/* HEADER */}
      <div className="text-white mb-5">
        <h1 className="fw-bold">My Bank Accounts </h1>

        <div className="mt-4 p-4 rounded-4"
             style={{
               background: "rgba(255,255,255,0.1)",
               backdropFilter: "blur(10px)"
             }}>
          <h5>Total Balance</h5>
          <h2 className="fw-bold">₹{totalBalance}</h2>
        </div>
      </div>

      {/* CARDS */}
      <div className="row">

        {accounts.map(acc => (
          <div className="col-md-4 mb-4" key={acc.id}>

            <div className="p-4 text-white shadow-lg"
                 style={{
                   borderRadius: "20px",
                   background: "linear-gradient(135deg, #ff7e5f, #feb47b)",
                   position: "relative",
                   overflow: "hidden"
                 }}>

              {/* Gloss effect */}
              <div style={{
                position: "absolute",
                top: "-60px",
                right: "-60px",
                width: "180px",
                height: "180px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50%"
              }} />

              <h5>{acc.bankName}</h5>

              <h4 className="mt-4">
                **** **** **** {acc.cardNumber?.slice(-4)}
              </h4>

              <div className="d-flex justify-content-between mt-4">

                <div>
                  <small>Card Holder</small>
                  <div>{acc.accountHolder}</div>
                </div>

                <div className="text-end">
                  <small>Balance</small>
                  <div className="fw-bold">₹{acc.balance}</div>
                </div>

              </div>

              <div className="d-flex justify-content-between mt-4">

                <button
                  className="btn btn-light btn-sm rounded-pill"
                  onClick={() => setForm(acc)}
                >
                  ✏️
                </button>

                <button
                  className="btn btn-danger btn-sm rounded-pill"
                  onClick={() => handleDelete(acc.id)}
                >
                  🗑
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* FLOATING ADD BUTTON */}
      <button
        onClick={() =>
          setForm({
            bankName: "",
            cardNumber: "",
            accountHolder: "",
            balance: ""
          })
        }
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          fontSize: "24px",
          background: "#00c6ff",
          border: "none",
          color: "white",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
        }}
      >
        +
      </button>

      {/* MODAL */}
      {form && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 rounded-4 shadow">

              <h4 className="mb-3 fw-bold">
                {form.id ? "Edit Card" : "Add Card"}
              </h4>

              <input
                className="form-control mb-3"
                placeholder="Bank Name"
                value={form.bankName}
                onChange={(e)=>setForm({...form, bankName:e.target.value})}
              />

              <input
                className="form-control mb-3"
                placeholder="Card Number"
                value={form.cardNumber}
                onChange={(e)=>setForm({...form, cardNumber:e.target.value})}
              />

              <input
                className="form-control mb-3"
                placeholder="Account Holder"
                value={form.accountHolder}
                onChange={(e)=>setForm({...form, accountHolder:e.target.value})}
              />

              <input
                type="number"
                className="form-control mb-3"
                placeholder="Balance"
                value={form.balance}
                onChange={(e)=>setForm({...form, balance:e.target.value})}
              />

              <div className="d-flex justify-content-between">

                <button className="btn btn-success px-4" onClick={handleSave}>
                  {form.id ? "Save" : "Add"}
                </button>

                <button className="btn btn-secondary px-4" onClick={()=>setForm(null)}>
                  Cancel
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Accounts;