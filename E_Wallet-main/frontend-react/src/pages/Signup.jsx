import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserAuthShell from "../components/UserAuthShell";

const signupMetrics = [
  { value: "Clean onboarding", label: "Profile details stay organized and easy to scan." },
  { value: "Setup ready", label: "Registration leads directly into secure account access." }
];

const signupFeatures = [
  {
    icon: "bi-person-plus",
    title: "Minimal signup friction",
    copy: "Only the fields that matter are emphasized, with cleaner spacing and hierarchy."
  },
  {
    icon: "bi-check2-circle",
    title: "Better first impression",
    copy: "A softer palette and clearer form rhythm make onboarding feel more polished."
  }
];

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    passkey: "",
    confirmPassword: ""
  });
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    if (formData.passkey !== formData.confirmPassword) {
      setFeedback({
        tone: "error",
        text: "Password and confirm password must match."
      });
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...payload } = formData;
      const response = await fetch("http://localhost:8081/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();

      if (!response.ok) {
        setFeedback({
          tone: "error",
          text: responseText || "Signup failed. Try a different username or verify the entered details."
        });
        setLoading(false);
        return;
      }

      navigate("/", {
        replace: true,
        state: {
          tone: "success",
          message: "Account created successfully. Sign in to continue with MFA setup."
        }
      });
    } catch (error) {
      console.error(error);
      setFeedback({
        tone: "error",
        text: "Unable to create the account right now. Please try again shortly."
      });
    }

    setLoading(false);
  };

  return (
    <UserAuthShell
      brandBadge="User Onboarding"
      brandTitle="Create your wallet profile."
      brandCopy="A simpler signup surface with a more premium light palette and less unnecessary content."
      metrics={signupMetrics}
      features={signupFeatures}
      formBadge="Create User Account"
      formTitle="Open your wallet profile"
      formCopy="Enter your details once, choose a secure password, and continue into account setup."
    >
      {feedback && (
        <div className={`user-auth-banner ${feedback.tone === "success" ? "is-success" : "is-error"}`}>
          <i className={`bi ${feedback.tone === "success" ? "bi-check-circle-fill" : "bi-exclamation-octagon-fill"}`} />
          <span>{feedback.text}</span>
        </div>
      )}

      <form className="user-auth-form" onSubmit={handleSubmit}>
        <div className="user-auth-grid">
          <div className="user-auth-field">
            <label className="user-auth-label" htmlFor="signup-name">
              Full name
            </label>
            <div className="user-auth-input-group">
              <span className="user-auth-input-icon">
                <i className="bi bi-person" />
              </span>
              <input
                id="signup-name"
                name="name"
                type="text"
                className="user-auth-input"
                placeholder="John Carter"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="user-auth-field">
            <label className="user-auth-label" htmlFor="signup-phone">
              Phone number
            </label>
            <div className="user-auth-input-group">
              <span className="user-auth-input-icon">
                <i className="bi bi-telephone" />
              </span>
              <input
                id="signup-phone"
                name="phone"
                type="tel"
                className="user-auth-input"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                inputMode="tel"
                required
              />
            </div>
          </div>
        </div>

        <div className="user-auth-field">
          <label className="user-auth-label" htmlFor="signup-email">
            Email address
          </label>
          <div className="user-auth-input-group">
            <span className="user-auth-input-icon">
              <i className="bi bi-envelope" />
            </span>
            <input
              id="signup-email"
              name="email"
              type="email"
              className="user-auth-input"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="user-auth-field">
          <label className="user-auth-label" htmlFor="signup-username">
            Username
          </label>
          <div className="user-auth-input-group">
            <span className="user-auth-input-icon">
              <i className="bi bi-at" />
            </span>
            <input
              id="signup-username"
              name="username"
              type="text"
              className="user-auth-input"
              placeholder="Choose a unique username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>
          <div className="user-auth-helper">Use a username that will be easy to identify during wallet-to-wallet payments.</div>
        </div>

        <div className="user-auth-grid">
          <div className="user-auth-field">
            <label className="user-auth-label" htmlFor="signup-password">
              Password
            </label>
            <div className="user-auth-input-group">
              <span className="user-auth-input-icon">
                <i className="bi bi-key" />
              </span>
              <input
                id="signup-password"
                name="passkey"
                type={showPassword ? "text" : "password"}
                className="user-auth-input with-toggle"
                placeholder="Create a secure password"
                value={formData.passkey}
                onChange={handleChange}
                autoComplete="new-password"
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
          </div>

          <div className="user-auth-field">
            <label className="user-auth-label" htmlFor="signup-confirm-password">
              Confirm password
            </label>
            <div className="user-auth-input-group">
              <span className="user-auth-input-icon">
                <i className="bi bi-shield-check" />
              </span>
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="user-auth-input with-toggle"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="user-auth-toggle"
                onClick={() => setShowConfirmPassword((current) => !current)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>

        <div className="user-auth-helper">
          Choose a password you do not reuse elsewhere. After sign-up, the flow continues into account security setup.
        </div>

        <button type="submit" className="user-auth-button" disabled={loading}>
          {loading ? "Creating your account..." : "Create Account"}
        </button>
      </form>

      <div className="user-auth-meta">
        <div className="user-auth-trust">
          <div className="user-auth-trust-icon">
            <i className="bi bi-person-check-fill" />
          </div>
          <div>
            <div className="user-auth-trust-title">Built for a clean first session</div>
            <div className="user-auth-trust-copy">
              Registration leads directly into user login and secure onboarding instead of dropping the user into a dead end.
            </div>
          </div>
        </div>

        <div className="user-auth-links">
          <div className="user-auth-links-row">
            <span>
              Already have an account? <Link to="/">Sign in</Link>
            </span>
          </div>
        </div>
      </div>
    </UserAuthShell>
  );
}

export default Signup;
