
import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Mail, ArrowLeft } from "lucide-react";
import "./Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      setMessage(data.message || "If the account exists, password reset instructions will be sent.");
    } catch (err) {
      setError(err.message || "Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <GraduationCap size={32} />
        </div>

        <h1>Forgot Password?</h1>

        <p className="auth-subtitle">
          Enter your registered email to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Email Address</label>

          <div className="auth-input">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {message && (
            <p style={{ color: "#22c55e", marginTop: "14px" }}>
              {message}
            </p>
          )}

          {error && (
            <p style={{ color: "#ff5b5b", marginTop: "14px" }}>
              {error}
            </p>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Reset Password"}
          </button>
        </form>

        <Link to="/login" className="back-home">
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
