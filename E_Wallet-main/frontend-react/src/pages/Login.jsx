import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        passkey: password
      })
    });

    if (!response.ok) {
      alert("Invalid username or password");
      return;
    }

    const data = await response.json();

    console.log("LOGIN RESPONSE:", data); // 🔍 DEBUG

    // 🔥 Validate response
    if (!data.userId) {
      alert("Login error: userId missing from backend");
      return;
    }

    // ✅ Store only after validation
    localStorage.setItem("username", username);
    localStorage.setItem("userId", data.userId);

    if (data.mfaRequired) {
      localStorage.setItem("mfaEnabled", "true");
      localStorage.setItem("tempToken", data.tempToken);

      window.location.href = "/mfa";
    } else {
      localStorage.setItem("mfaEnabled", "false");
      localStorage.setItem("token", data.token);

      window.location.href = "/dashboard";
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">

      <div className="row shadow rounded overflow-hidden" style={{ width: "800px" }}>

        {/* LEFT SIDE */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white"
             style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)" }}>

          <h2 className="fw-bold mb-3">E-Wallet</h2>
          <p className="text-center px-3">
            Secure, fast and smart way to manage your money.
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-6 bg-white p-5">

          <h3 className="mb-4 text-center fw-bold">Login</h3>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control rounded-pill px-3"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control rounded-pill px-3"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>

            <button className="btn btn-primary w-100 rounded-pill mb-3">
              Login
            </button>

            <div className="text-center">
              <small>
                Don't have an account?{" "}
                <Link to="/signup">Create one</Link>
              </small>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;