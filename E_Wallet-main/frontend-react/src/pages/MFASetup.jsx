import React, { useState, useEffect } from "react";

function MFASetup() {

  const [qrImage, setQrImage] = useState(null);
  const [status, setStatus] = useState("Checking...");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    checkStatus();
  }, []);

  // 🔹 CHECK MFA STATUS
  const checkStatus = async () => {
    try {
      const res = await fetch("http://localhost:8080/auth/mfa-status", {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const data = await res.json();
      setStatus(data.enabled ? "Enabled" : "Not Enabled");

    } catch {
      setStatus("Unknown");
    }
  };

  // 🔹 ENABLE MFA
  const handleEnableMFA = async () => {

    if (status === "Enabled") {
      alert("MFA is already enabled");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/auth/enable-mfa",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      const data = await response.json();

      if (data.qrImage) {
        setQrImage(data.qrImage);
        setStatus("Enabled");
      } else {
        alert(data.message || "QR not available");
      }

    } catch {
      alert("Server error");
    }

    setLoading(false);
  };

  // 🔹 DISABLE MFA
  const handleDisableMFA = async () => {

    if (!window.confirm("Are you sure you want to disable MFA?")) return;

    try {
      await fetch("http://localhost:8080/auth/disable-mfa", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token
        }
      });

      setStatus("Not Enabled");
      setQrImage(null);

    } catch {
      alert("Failed to disable MFA");
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

      <div className="container">

        <div
          style={{
            maxWidth: "700px",
            margin: "auto",
            background: "#ffffff",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.12)"
          }}
        >

          {/* HEADER */}
          <div className="mb-4">
            <h3 className="fw-bold mb-1">Multi-Factor Authentication</h3>
            <p className="text-muted">
              Secure your account with Google Authenticator
            </p>
          </div>

          {/* STATUS */}
          <div className="mb-4 d-flex justify-content-between align-items-center">

            <span className="fw-semibold">Status</span>

            <span
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                background: status === "Enabled" ? "#dcfce7" : "#fee2e2",
                color: status === "Enabled" ? "#15803d" : "#b91c1c",
                fontWeight: "500"
              }}
            >
              {status}
            </span>

          </div>

          {/* INSTRUCTIONS */}
          <div
            className="mb-4 p-3"
            style={{
              background: "#f9fafb",
              borderRadius: "12px",
              border: "1px solid #e5e7eb"
            }}
          >
            <h6 className="fw-semibold mb-2">Setup Steps</h6>

            <ul className="text-muted mb-0" style={{ paddingLeft: "18px" }}>
              <li>Install <b>Google Authenticator</b></li>
              <li>Click "Generate QR Code"</li>
              <li>Scan the QR code</li>
              <li>Logout & login again</li>
              <li>Enter OTP during login</li>
            </ul>
          </div>

          {/* BUTTONS */}
          <div className="d-flex gap-3 mb-4">

            <button
              className="btn btn-dark w-100 rounded-pill"
              onClick={handleEnableMFA}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate QR Code"}
            </button>

            {status === "Enabled" && (
              <button
                className="btn btn-danger w-100 rounded-pill"
                onClick={handleDisableMFA}
              >
                Disable MFA
              </button>
            )}

          </div>

          {/* QR */}
          {qrImage && (
            <div className="text-center">

              <h6 className="fw-semibold mb-3">
                Scan QR Code
              </h6>

              <img
                src={`data:image/png;base64,${qrImage}`}
                alt="QR"
                style={{
                  width: "200px",
                  padding: "10px",
                  background: "#fff",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb"
                }}
              />

              <p className="mt-3 text-muted small">
                After scanning, logout and login again to activate MFA
              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default MFASetup;