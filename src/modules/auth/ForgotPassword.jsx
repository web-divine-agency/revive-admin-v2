import { useState } from "react";
import "./Auth.scss";
import password from "@/assets/images/password.png";
import axiosInstance from "@/services/axiosInstance.js";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isEmailNotFound, setIsEmailNotFound] = useState(false);
  const navigate = useNavigate();

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/reset-password", { email });

      setMessage("Reset instructions sent! Check your email.");
      setIsEmailNotFound(false);
      setTimeout(() => navigate("/open-email", { state: { email } }), 3000);
    } catch {
      setMessage("Oops! We couldn't locate that email.");
      setIsEmailNotFound(true);
      // setSuccessMessage("");
    }
  };
  const handleHideAlert = async () => {
    setIsEmailNotFound(false);
    setMessage("");
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
          <p
            className={`alert ${
              isEmailNotFound ? "alert-danger" : "alert-success"
            }`}
          >
            {message}
            {isEmailNotFound && (
              <div
                className={"close-quick-alert"}
                onClick={handleHideAlert}
              ></div>
            )}
          </p>
        )}
        <form
          className="forgot-password-form"
          onSubmit={handlePasswordResetRequest}
        >
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            // placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`reset-password-btn ${
              isEmailNotFound ? "btn-danger" : "btn-success"
            }`}
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
