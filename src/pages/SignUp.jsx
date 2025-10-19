import { useState } from "react";
import api from "../api/axiosInstance";
import { SUPPORT_EMAIL } from "../constants/contact";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showRequestOtpForm, setShowRequestOtpForm] = useState(true);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState("");
  const [requestId, setRequestId] = useState("");
  const [acknowledgeTerms, setAcknowledgeTerms] = useState(false);
  const [acknowledgePrivacy, setAcknowledgePrivacy] = useState(false);

  const isConditionsAcknowledgeByUser = acknowledgeTerms && acknowledgePrivacy;

  const requestOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Email Id is required");
      return;
    }
    try {
      const response = await api.post("/session/requestSignupOtp", {
        emailId: email,
      });
      setRequestId(response?.data?.requestId || "");
      setShowRequestOtpForm(false);
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.operationMessage
      ) {
        setError(err.response.data.operationMessage);
      } else {
        setError("Failed to request signup OTP.");
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSignUpSuccess("");
    if (!otp || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await api.post("/session/signUp", {
        emailId: email,
        otp,
        password,
        requestId,
      });

      // Success: clear fields and show login link
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setSignUpSuccess(
        "Password reset successfully, please login using new password.",
      );
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.operationMessage
      ) {
        setError(err.response.data.operationMessage);
      } else {
        setError("Failed to reset password.");
      }
    }
  };

  // Form for requesting otp
  const requestSignUpOTPForm = (
    <form onSubmit={requestOtp}>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="email">Email Id</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
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
        Request Sign Up OTP
      </button>
    </form>
  );

  const signUpForm = (
    <form onSubmit={handleSignUp}>
      <div style={{ marginBottom: 16 }}>
        <label>Email Id</label>
        <input
          type="email"
          value={email}
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
        Please check your email for the OTP.
        <br />
        If you don’t see the email in your inbox, be sure to check your spam or
        junk folder.
        <br />
        The email will be sent from <strong>{SUPPORT_EMAIL}</strong>.
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>
          One Time Password (OTP) <span style={{ color: "red" }}>*</span>
        </label>
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
        <label>
          Password <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        <label>
          Confirm Password <span style={{ color: "red" }}>*</span>
        </label>
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
      <div className="mb-3 form-check">
        <input
          type="checkbox"
          id="terms"
          className="form-check-input"
          checked={acknowledgeTerms}
          onChange={(e) => setAcknowledgeTerms(e.target.checked)}
        />
        <label htmlFor="terms" className="form-check-label small">
          <span style={{ color: "red" }}>*</span> I have read and agree to the{" "}
          <a href="#">Terms and Conditions</a>.
        </label>
      </div>
      <div className="mb-3 form-check">
        <input
          type="checkbox"
          id="privacy"
          className="form-check-input"
          checked={acknowledgePrivacy}
          onChange={(e) => setAcknowledgePrivacy(e.target.checked)}
        />
        <label htmlFor="privacy" className="form-check-label small">
          <span style={{ color: "red" }}>*</span> I have read and acknowledge
          the <a href="#">Privacy Policy</a>.
        </label>
      </div>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <button
        type="submit"
        disabled={!isConditionsAcknowledgeByUser}
        style={{
          width: "100%",
          padding: 10,
          background: isConditionsAcknowledgeByUser ? "#A42502" : "#ccc",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          fontWeight: "bold",
          cursor: isConditionsAcknowledgeByUser ? "pointer" : "not-allowed",
        }}
      >
        Sign Up
      </button>
    </form>
  );

  const signUpSuccessMessage = (
    <div style={{ color: "green", marginBottom: 8, textAlign: "center" }}>
      Sign Up completed successfully, please login using below link.
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
      className="signup-container"
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
        background: "#fff",
      }}
    >
      <h3 className="mb-4 fw-bold">Sign Up</h3>
      {signUpSuccess
        ? signUpSuccessMessage
        : showRequestOtpForm
          ? requestSignUpOTPForm
          : signUpForm}
    </div>
  );
};

export default SignUp;
