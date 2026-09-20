import { useState } from "react";
import api from "../api/axiosInstance";
import { SUPPORT_EMAIL } from "../constants/contact";

const SignUp = () => {
  const [registerMethod, setRegisterMethod] = useState("mobile"); // "email" | "mobile"
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
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

    if (registerMethod === "email" && !email) {
      setError("Email Id is required");
      return;
    }
    if (registerMethod === "mobile") {
      if(!mobile) {
        setError("Mobile number is required");
        return;
      }
      // Remove any non-digit characters just in case
      const digitsOnly = mobile.replace(/\D/g, "");
      if (digitsOnly.length < 10) {
        setError("Please enter a valid mobile number.");
        return;
      }
    }

    try {
      const payload =
        registerMethod === "email"
          ? { emailId: email, otpChannel: "email" }
          : { mobileNumber: mobile, otpChannel: "mobile" };

      const response = await api.post("/session/requestSignupOtp", payload);
      setRequestId(response?.data?.requestId || "");
      setShowRequestOtpForm(false);
      setMobile(response?.data?.mobileNumber || mobile)
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

    if (!otp) {
      setError("OTP is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (!confirmPassword) {
      setError("Confirm you password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const payload =
        registerMethod === "email"
          ? { emailId: email, otpChannel: "email", otp, password, requestId }
          : { mobileNumber: mobile, otpChannel: "mobile", otp, password, requestId };

      await api.post("/session/signUp", payload);

      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setSignUpSuccess("Sign Up completed successfully.");
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.operationMessage
      ) {
        setError(err.response.data.operationMessage);
      } else {
        setError("Failed to sign up.");
      }
    }
  };

  // ---------- Request OTP Form ----------
  const requestSignUpOTPForm = (
    <form onSubmit={requestOtp}>
      <div style={{ marginBottom: 16 }}>
        <label className="fw-bold">How do you want to register?</label>
        <div style={{ display: "flex", gap: "16px", marginTop: 8 }}>
          <label>
            <input
              type="radio"
              value="email"
              checked={registerMethod === "email"}
              onChange={(e) => setRegisterMethod(e.target.value)}
            />{" "}
            Email
          </label>
          <label>
            <input
              type="radio"
              value="mobile"
              checked={registerMethod === "mobile"}
              onChange={(e) => setRegisterMethod(e.target.value)}
            />{" "}
            Mobile
          </label>
        </div>
      </div>

      {registerMethod === "email" ? (
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email">Email Id</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email Id"
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
      ) : (
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="mobile">Mobile Number</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                marginTop: 4,
                border: "1px solid #ccc",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <input
                type="tel"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  padding: "8px 10px",
                  fontSize: "1rem",
                }}
                required
              />
            </div>
          </div>
      )}

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

  // ---------- Sign Up Form ----------
  const signUpForm = (
    <form onSubmit={handleSignUp}>
      <div style={{ marginBottom: 16 }}>
        <label>{registerMethod === "email" ? "Email Id" : "Mobile Number"}</label>
        <input
          type={registerMethod === "email" ? "email" : "tel"}
          value={registerMethod === "email" ? email : mobile}
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
        {registerMethod === "email" ? (
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
                href="https://wa.me/917396358265?text=Rajput%20Chhipa%20App%20Admin,%20please%20send%20my%20Sign-Up%20OTP."
                target="_blank"
                rel="noopener noreferrer"
              >
                Rohit Rajput (+91 73963 58265)
              </a>
              <br />
              <a
                href="https://wa.me/918317059394?text=Rajput%20Chhipa%20App%20Admin,%20please%20send%20my%20Sign-Up%20OTP."
                target="_blank"
                rel="noopener noreferrer"
              >
                Veeru Bajnawale (+91 83170 59394)
              </a>
              <br />
              <a
                href="https://wa.me/15714843763?text=Rajput%20Chhipa%20App%20Admin,%20please%20send%20my%20Sign-Up%20OTP."
                target="_blank"
                rel="noopener noreferrer"
              >
                Vijay (+1 571-484-3763)
              </a>
              <br />
              <br /><br />
              "<i>Rajput Chhipa App Admin, please send my Sign-Up OTP.</i>" <br /><br />
              Admin will provide your OTP to your WhatsApp number directly. <br />
            </small>
        )}
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
          <span style={{ color: "red" }}>*</span> I agree to the{" "}
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
          <span style={{ color: "red" }}>*</span> I acknowledge the{" "}
          <a href="#">Privacy Policy</a>.
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

  // ---------- Success Message ----------
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
      {signUpSuccess ? signUpSuccessMessage
        : showRequestOtpForm ? requestSignUpOTPForm : signUpForm}
    </div>
  );
};

export default SignUp;
