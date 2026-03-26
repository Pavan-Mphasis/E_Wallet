import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddAccount() {
  const [form, setForm] = useState({
    bankName: "",
    cardNumber: "",
    accountHolder: "",
    balance: ""
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("TOKEN BEING SENT:", token); // 🔥 ADD THIS

    await fetch("http://localhost:8081/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        bankName: form.bankName,
        cardNumber: form.cardNumber,
        accountHolder: form.accountHolder,
        balance: Number(form.balance),
        userId: Number(userId)   // 🔥 REQUIRED
      })
    });

    navigate("/accounts"); // go back
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="bankName" placeholder="Bank Name" onChange={handleChange} />
      <input name="cardNumber" placeholder="Card Number" onChange={handleChange} />
      <input name="accountHolder" placeholder="Holder Name" onChange={handleChange} />
      <input name="balance" placeholder="Balance" onChange={handleChange} />

      <button type="submit">Add Account</button>
    </form>
  );
}

export default AddAccount;
