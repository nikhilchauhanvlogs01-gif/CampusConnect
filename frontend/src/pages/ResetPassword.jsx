
import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!token) {
      toast.error("Reset link is invalid. Request a new link.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          token,
          password,
        }
      );

      toast.success(
        response.data.message || "Password updated successfully!"
      );

      navigate("/login");
    } catch (error) {
      console.error("Reset Password Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to connect to server. Please check backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">

        <Link to="/login" className="reset-back-link">
          <ArrowLeft size={17} />
          Back to Login
        </Link>

        <div className="reset-icon">
          <LockKeyhole size={30} />
        </div>

        <h1>Create New Password</h1>

        <p className="reset-subtitle">
          Create a new password for your CampusConnect account.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="reset-field">
            <label>New Password</label>

            <div className="reset-input-wrapper">
              <LockKeyhole size={18} className="reset-input-icon" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div className="reset-field">
            <label>Confirm New Password</label>

            <div className="reset-input-wrapper">
              <LockKeyhole size={18} className="reset-input-icon" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          <div className="password-hint">
            <ShieldCheck size={17} />
            Password must contain at least 8 characters.
          </div>

          <button
            type="submit"
            className="reset-submit-btn"
            disabled={loading}
          >
            {loading ? "Updating Password..." : "Reset Password"}
          </button>

        </form>

        <div className="reset-footer">
          Secure Password Recovery · CampusConnect
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
