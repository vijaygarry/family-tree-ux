import React, { useState } from "react";
import api from "../api/axiosInstance";
import { SUPPORT_EMAIL } from "../constants/contact";

const ForgotPassword = () => {
  const [loginName, setLoginName] = useState("");
  const [otpChannel, setOtpChannel] = useState("mobile"); // "email" | "mobile"
  const [error, setError] = useState("");
  const [showRequestOTPForm, setShowRequestOTPForm] = useState(true);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState("");
  const [requestId, setRequestId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!loginName) {
      setError("Please enter mobile number or email Id.");
      return;
    }
    try {
      const response = await api.post("/session/requestForgotPasswordOTP", {
        loginName: loginName,
      });
      if (response && response.data) {
        if(response.data.requestId) {
          setRequestId(response.data.requestId);
        }
        if(response.data.otpChannel) {
          setOtpChannel(response.data.otpChannel);
        }
        if(response.data.loginName) {
          setLoginName(response.data.loginName);
        }
      }
      setShowRequestOTPForm(false);
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.operationMessage
      ) {
        setError(err.response.data.operationMessage);
      } else {
        setError("Failed to generate OTP.");
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetPasswordSuccess("");
    if (!otp || !newPassword || !confirmPassword) {
      setResetError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }
    try {
      await api.post("/session/resetForgotPassword", {
        loginName: loginName,
        otp,
        newPassword,
        confirmPassword,
        requestId,
        otpChannel,
      });

      // Success: clear fields and show login link
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setShowRequestOTPForm(false);
      setResetPasswordSuccess(
        "Password reset successfully, please login using new password.",
      );
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.operationMessage
      ) {
        setResetError(err.response.data.operationMessage);
      } else {
        setResetError("Failed to reset password.");
      }
    }
  };

  // Form for requesting reset link
  const requestForgotPwdOTPForm = (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
          <label htmlFor="loginName" className="form-label fw-semibold">
            Email Id or Mobile Number <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            style={{ minHeight: "45px" }}
            onChange={(e) => setLoginName(e.target.value)}
          />
        </div>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <button
        type="submit"
        style={{
          width: "100%",
          padding: 10,
          background: "#a42502",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          fontWeight: "bold",
        }}
      >
        Request Forgot Password OTP
      </button>
    </form>
  );

  // Form for resetting password
  const forgotPasswordForm = (
    <form onSubmit={handleResetPassword}>
      <div style={{ marginBottom: 16 }}>
        <label>{otpChannel === "email" ? "Email Id" : "Mobile Number"}</label>
        <input
          type="text"
          value={loginName}
          readOnly
          style={{
            width: "100%",
            padding: 8,
            marginTop: 4,
            borderRadius: 4,
            border: "1px solid #ccc",
            background: "#f5f5f5",
          }}
        />
      </div>
      <div
        className="alert alert-info"
        style={{
          fontSize: "1rem",
          background: "#e8f4fd",
          color: "#0c5460",
          border: "1px solid #b6e0fe",
        }}
      >
        {otpChannel === "email" ? (
          <small>
            Please check your email for the OTP.
            <br />
            If you don’t see the email in your inbox, check your spam or junk
            folder.
            <br />
            The email will be sent from <strong>{SUPPORT_EMAIL}</strong>.
          </small>
        ) : (
            <small>To get your OTP, send the following message through WhatsApp to <br />
              <a
                href="https://wa.me/15714843763?text=Rajput%20Chhipa%20App%20Admin,%20please%20send%20my%20Forget%20Password%20OTP."
                target="_blank"
                rel="noopener noreferrer"
              >
                Vijay (+1 571-484-3763)
              </a>
              <br />

              <a
                href="https://wa.me/919545727818?text=Rajput%20Chhipa%20App%20Admin,%20please%20send%20my%20Forget%20Password%20OTP."
                target="_blank"
                rel="noopener noreferrer"
              >
                Nikhil (+91 954-572-7818)
              </a>
              <br /><br />
              "<i>Rajput Chhipa App Admin, please send my Forget Password OTP.</i>" <br /><br />
              Admin will provide your OTP to your WhatsApp number directly. <br />
            </small>
        )}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>One Time Password (OTP)</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            marginTop: 4,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
          required
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            marginTop: 4,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
          required
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            marginTop: 4,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
          required
        />
      </div>
      {resetError && (
        <div style={{ color: "red", marginBottom: 8 }}>{resetError}</div>
      )}
      <button
        type="submit"
        style={{
          width: "100%",
          padding: 10,
          background: "#A42502",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          fontWeight: "bold",
        }}
      >
        Change Password
      </button>
    </form>
  );

  // Success message
  const forgotPasswordSuccess = (
    <div style={{ color: "green", marginBottom: 8, textAlign: "center" }}>
      Password reset successfully, please login using new password.
      <br />
      <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
        <button
          onClick={() => (window.location.href = "/login")}
          style={{
            padding: "8px 16px",
            background: "#A42502",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="forgot-password-container"
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
        background: "#fff",
      }}
    >
      <h3 className="mb-4 fw-bold">Forgot Password</h3>
      {resetPasswordSuccess
        ? forgotPasswordSuccess
        : showRequestOTPForm
          ? requestForgotPwdOTPForm
          : forgotPasswordForm}
    </div>
  );
};

export default ForgotPassword;
