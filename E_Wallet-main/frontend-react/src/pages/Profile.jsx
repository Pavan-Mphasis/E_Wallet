import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch("http://localhost:8081/user/details", {
        headers: { Authorization: "Bearer " + token }
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      if (data.error || data.message) return;
      setUser({ username: data.username || "" });
      setEmail(data.email || "");
      setMfaEnabled(data.mfaEnabled || false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleChangeEmail = async () => {
    if (!newEmail) {
      setMessage("Enter email");
      return;
    }
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8081/user/change-email", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ email: newEmail })
    });
    const data = await res.json();
    if (res.ok && !data.error && data.message !== "Invalid email") {
      setShowEmailModal(false);
      setNewEmail("");
      fetchProfile();
    } else {
      setMessage(data.message || data.error || "Failed to update email");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8081/user/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (res.ok && !data.error && data.message === "Password updated successfully") {
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setMessage(data.message || data.error || "Failed to update password");
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
    width: "100%",
    marginBottom: "15px"
  };

  return (
    <div style={{ padding: "40px 20px", display: "flex", justifyContent: "center" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ width: "100%", maxWidth: "600px" }}>
        
        {/* HEADER */}
        <div className="mb-4 text-center">
          <h3 className="fw-bold mb-0 text-white" style={{ letterSpacing: "-0.5px" }}>My Profile</h3>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>Manage your personal information</p>
        </div>

        <div style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderRadius: "24px", padding: "40px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          
          <div className="text-center mb-5">
            <div style={{ width: "90px", height: "90px", borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", color: "#fff", fontWeight: "bold", boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)", border: "3px solid rgba(255,255,255,0.1)" }}>
              {user.username ? user.username.charAt(0).toUpperCase() : localStorage.getItem("username")?.charAt(0).toUpperCase() || "U"}
            </div>
            <h4 className="text-white mt-3 fw-bold mb-1">@{user.username || localStorage.getItem("username") || "user"}</h4>
            <p style={{ color: "#94a3b8", margin: 0 }}>{email || "No email available"}</p>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center" style={{ background: "rgba(0,0,0,0.2)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 5px 0" }}>Email Address</p>
                  <div className="text-white fw-semibold">{email}</div>
                </div>
                <button className="btn btn-sm" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: "8px" }} onClick={() => setShowEmailModal(true)}>
                  Change
                </button>
              </div>
            </div>

            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center" style={{ background: "rgba(0,0,0,0.2)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 5px 0" }}>Password</p>
                  <div className="text-white fw-semibold">••••••••</div>
                </div>
                <button className="btn btn-sm" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: "8px" }} onClick={() => setShowPasswordModal(true)}>
                  Change
                </button>
              </div>
            </div>

            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center" style={{ background: "rgba(0,0,0,0.2)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 5px 0" }}>2FA Security</p>
                  <div className="text-white fw-semibold d-flex align-items-center">
                    {mfaEnabled ? (
                      <><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", marginRight: "8px" }}></span> Enabled</>
                    ) : (
                      <><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", marginRight: "8px" }}></span> Disabled</>
                    )}
                  </div>
                </div>
                {!mfaEnabled && (
                  <Link to="/setup-mfa" className="btn btn-sm" style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", borderRadius: "8px" }}>Setup 2FA</Link>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 text-center">
            <button onClick={handleLogout} className="btn w-100 fw-semibold" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#fca5a5", padding: "14px", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
              Sign Out
            </button>
          </div>

        </div>
      </motion.div>

      {/* EMAIL MODAL */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="modal d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.6)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050, backdropFilter: "blur(5px)" }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="p-4" style={{ width: "100%", maxWidth: "400px", background: "#1e293b", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold text-white m-0">Change Email</h4>
                <button className="btn btn-sm" style={{ color: "#94a3b8", background: "rgba(255,255,255,0.1)", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", border: "none" }} onClick={() => { setShowEmailModal(false); setMessage(""); }}>×</button>
              </div>
              <input type="email" className="form-control" placeholder="New email address" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={inputStyle} />
              {message && <p style={{ color: "#fca5a5", fontSize: "14px", marginBottom: "15px" }}>{message}</p>}
              <button className="btn w-100 fw-semibold text-white mt-2" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", padding: "12px", borderRadius: "12px", border: "none" }} onClick={handleChangeEmail}>
                Update Email
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PASSWORD MODAL */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="modal d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.6)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050, backdropFilter: "blur(5px)" }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="p-4" style={{ width: "100%", maxWidth: "400px", background: "#1e293b", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold text-white m-0">Change Password</h4>
                <button className="btn btn-sm" style={{ color: "#94a3b8", background: "rgba(255,255,255,0.1)", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", border: "none" }} onClick={() => { setShowPasswordModal(false); setMessage(""); }}>×</button>
              </div>
              <input type="password" className="form-control" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={inputStyle} />
              <input type="password" className="form-control" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={inputStyle} />
              <input type="password" className="form-control" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />
              {message && <p style={{ color: "#fca5a5", fontSize: "14px", marginBottom: "15px" }}>{message}</p>}
              <button className="btn w-100 fw-semibold text-white mt-2" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", padding: "12px", borderRadius: "12px", border: "none" }} onClick={handleChangePassword}>
                Update Password
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Profile;
