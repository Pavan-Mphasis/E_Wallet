import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Success from "./pages/Success";
import AddMoney from "./pages/AddMoney";
import Dashboard from "./pages/Dashboard";
import MFA from "./pages/MFA";
import MFASetup from "./pages/MFASetup";
import Transactions from "./pages/Transactions";
import Transfer from "./pages/Transfer";
import Profile from "./pages/Profile";
import Accounts from "./pages/Accounts";
import AddAccount from "./pages/AddAccount";
import axios from "axios";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/success" element={<Success />} />
        <Route path="/addmoney" element={<AddMoney />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mfa" element={<MFA />} />
        <Route path="/mfa-setup" element={<MFASetup />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/add-account" element={<AddAccount />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;