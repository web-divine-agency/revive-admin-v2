// ForgotPassword.js
import React, { useState } from "react";
import "./PasswordReset.css";
import password from "../../assets/images/password.png";
import { useNavigate } from "react-router-dom";

// Mock data
const users = [{ email: "test@example.com", password: "123456" }];

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isEmailNotFound, setIsEmailNotFound] = useState(false);
  const navigate = useNavigate();

  const handlePasswordResetRequest = (e) => {
    e.preventDefault();
    const user = users.find((user) => user.email === email);
    if (user) {
      setMessage("Reset instructions sent! Check your email.");
      setIsEmailNotFound(false);
      setTimeout(() => navigate("/open-email", { state: { email } }), 3000);
    } else {
      setMessage("Email not found.");
      setIsEmailNotFound(true);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-icon">
          <img src={password} alt="lock" />
        </div>
        <h2>Forgot password?</h2>
        <p>No worries, we’ll send you reset instructions.</p>
        {message && (
          <p className={`alert ${isEmailNotFound ? "alert-danger" : "alert-success"}`}>
            {message}
          </p>
        )}
        <form className="forgot-password-form" onSubmit={handlePasswordResetRequest}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`reset-password-btn ${isEmailNotFound ? "btn-danger" : "btn-success"}`}
          >
            Reset password
          </button>
        </form>
        <a href="/" className="back-to-login">
          ← Back to log in
        </a>
      </div>
    </div>
  );
}

export default ForgotPassword;
