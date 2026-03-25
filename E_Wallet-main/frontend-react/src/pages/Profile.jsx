import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Profile() {

  const [user, setUser] = useState({ username: "" });
  const [email, setEmail] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // 🔁 Fetch profile data
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Login again.");
      navigate("/");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/user/details", {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }

      const data = await res.json();

      console.log("USER DATA:", data);

      if (data.error || data.message) {
        alert(data.error || data.message);
        navigate("/");
        return;
      }

      setUser({ username: data.username || "" });
      setEmail(data.email || "");
      setMfaEnabled(data.mfaEnabled || false);

    } catch (err) {
      console.error(err);
      alert("Backend not reachable / token invalid");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // 📧 CHANGE EMAIL
  const handleChangeEmail = async () => {

    if (!newEmail) {
      alert("Enter email");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8080/user/change-email", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ email: newEmail })
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      setShowEmailModal(false);
      setNewEmail("");
      fetchProfile(); // 🔥 refresh from backend
    }
  };

  // 🔐 CHANGE PASSWORD
  const handleChangePassword = async () => {

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8080/user/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #A28dd2, #FBC2EB)",
        padding: "40px"
      }}
    >

      {/* NAVBAR */}
      <nav className="d-flex justify-content-between align-items-center px-4 py-3 mb-4"
        style={{
          background: "rgba(255,255,255,0.9)",
          borderRadius: "12px"
        }}>
        <h5 className="fw-bold m-0">E-Wallet</h5>

        <div>
          <Link to="/dashboard" className="btn btn-outline-dark me-2">
            Dashboard
          </Link>
          <button onClick={handleLogout} className="btn btn-dark">
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "18px"
        }}
      >

        <h2 className="fw-bold mb-4">My Account</h2>

        {/* PROFILE */}
        <div className="mb-4 p-4 border rounded">
          <h6>👤 Profile Info</h6>

          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {email}</p>

          <button
            className="btn btn-outline-primary w-100 mb-2"
            onClick={() => setShowEmailModal(true)}
          >
            Change Email
          </button>

          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
        </div>

        {/* SECURITY */}
        <div className="p-4 border rounded">
          <h6>🔐 Security</h6>

          <p>
            MFA Status:{" "}
            <span className={`badge ${mfaEnabled ? "bg-success" : "bg-secondary"}`}>
              {mfaEnabled ? "Enabled" : "Disabled"}
            </span>
          </p>

          <button
            className="btn btn-warning w-100"
            onClick={() => navigate("/mfa-setup")}
          >
            Enable MFA (Scan QR)
          </button>
        </div>

      </motion.div>

      {/* EMAIL MODAL */}
      {showEmailModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-4">

              <h5>Change Email</h5>

              <input
                type="email"
                className="form-control mb-3"
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />

              <button className="btn btn-primary w-100" onClick={handleChangeEmail}>
                Update
              </button>

              <button
                className="btn btn-secondary w-100 mt-2"
                onClick={() => setShowEmailModal(false)}
              >
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-4">

              <h5>Change Password</h5>

              <input
                type="password"
                className="form-control mb-2"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <input
                type="password"
                className="form-control mb-2"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button className="btn btn-primary w-100" onClick={handleChangePassword}>
                Update
              </button>

              <button
                className="btn btn-secondary w-100 mt-2"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;