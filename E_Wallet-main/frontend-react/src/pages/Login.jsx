import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserAuthShell from "../components/UserAuthShell";

const loginMetrics = [
  { value: "MFA aware", label: "Security-enabled users continue directly into verification." },
  { value: "Fast return", label: "A cleaner form reduces friction for repeat sign-ins." }
];

const loginFeatures = [
  {
    icon: "bi-wallet2",
    title: "Wallet access without clutter",
    copy: "The page stays focused on getting users into their account quickly."
  },
  {
    icon: "bi-shield-check",
    title: "Security stays visible",
    copy: "Clear states for blocked accounts, MFA steps, and role-based routing."
  }
];

const readJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    if (!location.state?.message) {
      return;
    }

    setBanner({
      tone: location.state.tone || "success",
      text: location.state.message
    });
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setBanner(null);

    try {
      const response = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          passkey: password
        })
      });

      const data = await readJson(response);

      if (!response.ok) {
        setBanner({
          tone: "error",
          text: data.message || "Invalid username or password"
        });
        setLoading(false);
        return;
      }

      if (!data.userId) {
        setBanner({
          tone: "error",
          text: "Login failed because the user id was not returned by the server."
        });
        setLoading(false);
        return;
      }

      const role = data.role || "USER";
      localStorage.setItem("username", username);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", role);

      if (data.mfaRequired) {
        localStorage.setItem("mfaEnabled", "true");
        localStorage.setItem("tempToken", data.tempToken);
        localStorage.setItem("tempRole", role);
        navigate("/mfa");
      } else if (role === "ADMIN") {
        localStorage.setItem("mfaEnabled", "false");
        localStorage.setItem("token", data.token);
        localStorage.removeItem("tempToken");
        localStorage.removeItem("tempRole");
        navigate("/admin/users");
      } else {
        localStorage.setItem("mfaEnabled", "false");
        localStorage.setItem("token", data.token);
        localStorage.removeItem("tempToken");
        localStorage.removeItem("tempRole");
        navigate("/mfa-setup", {
          state: { info: "Please set up two-factor authentication to secure your account." }
        });
      }
    } catch (error) {
      console.error(error);
      setBanner({
        tone: "error",
        text: "Unable to reach the server right now. Try again in a moment."
      });
    }

    setLoading(false);
  };

  return (
    <UserAuthShell
      brandBadge="User Sign-In"
      brandTitle="Sign in to your wallet."
      brandCopy="A lighter, more refined access screen with less noise and a clearer path into the product."
      metrics={loginMetrics}
      features={loginFeatures}
      formBadge="User Access"
      formTitle="Welcome back"
      formCopy="Enter your details to continue into your wallet and security flow."
    >
      {banner && (
        <div className={`user-auth-banner ${banner.tone === "success" ? "is-success" : "is-error"}`}>
          <i className={`bi ${banner.tone === "success" ? "bi-check-circle-fill" : "bi-exclamation-octagon-fill"}`} />
          <span>{banner.text}</span>
        </div>
      )}

      <form className="user-auth-form" onSubmit={handleSubmit}>
        <div className="user-auth-field">
          <label className="user-auth-label" htmlFor="login-username">
            Username
          </label>
          <div className="user-auth-input-group">
            <span className="user-auth-input-icon">
              <i className="bi bi-person-circle" />
            </span>
            <input
              id="login-username"
              type="text"
              className="user-auth-input"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="user-auth-field">
          <label className="user-auth-label" htmlFor="login-password">
            Password
          </label>
          <div className="user-auth-input-group">
            <span className="user-auth-input-icon">
              <i className="bi bi-key" />
            </span>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              className="user-auth-input with-toggle"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="user-auth-toggle"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="user-auth-helper">
            If your account has MFA enabled, you will verify the session in the next step.
          </div>
        </div>

        <button type="submit" className="user-auth-button" disabled={loading}>
          {loading ? "Signing you in..." : "Sign In"}
        </button>
      </form>

      <div className="user-auth-meta">
        <div className="user-auth-trust">
          <div className="user-auth-trust-icon">
            <i className="bi bi-shield-lock-fill" />
          </div>
          <div>
            <div className="user-auth-trust-title">Security-first access</div>
            <div className="user-auth-trust-copy">
              Blocked accounts are stopped early, MFA users continue through verification, and admin access stays separate.
            </div>
          </div>
        </div>

        <div className="user-auth-links">
          <div className="user-auth-links-row">
            <span>
              New here? <Link to="/signup">Create your account</Link>
            </span>
            <span>
              Admin access? <Link to="/admin-login">Use admin login</Link>
            </span>
          </div>
        </div>
      </div>
    </UserAuthShell>
  );
}

export default Login;
