import { useState } from "react";
import api from "../api/axiosInstance";
import ERROR_MESSAGES from "../constants/messages";
import { SuccessBanner, FailureBanner } from "../components/AlertBanners";
import MemberCard from "../components/MemberCard";

const RegisterMarriage = () => {
  const [husbandIdInput, setHusbandIdInput] = useState("");
  const [husband, setHusband] = useState(null);
  const [husbandError, setHusbandError] = useState("");
  const [husbandLoading, setHusbandLoading] = useState(false);

  const [wifeIdInput, setWifeIdInput] = useState("");
  const [wife, setWife] = useState(null);
  const [wifeError, setWifeError] = useState("");
  const [wifeLoading, setWifeLoading] = useState(false);

  const [weddingDate, setWeddingDate] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const lookupHusband = async () => {
    if (!husbandIdInput.trim()) {
      setHusbandError("Please enter a member ID.");
      return;
    }
    setHusbandLoading(true);
    setHusbandError("");
    setHusband(null);
    setWife(null);
    setWifeIdInput("");
    setWifeError("");
    setWeddingDate("");
    setSubmitError("");
    setSubmitSuccess("");
    try {
      const res = await api.post("/family/getmemberprofile", {
        memberId: parseInt(husbandIdInput),
      });
      const profile = res.data?.memberProfile;
      if (profile) {
        setHusband(profile);
      } else {
        setHusbandError("Member not found.");
      }
    } catch (err) {
      setHusbandError(
        err.response?.data?.operationMessage || ERROR_MESSAGES.DEFAULT
      );
    } finally {
      setHusbandLoading(false);
    }
  };

  const lookupWife = async () => {
    if (!wifeIdInput.trim()) {
      setWifeError("Please enter a member ID.");
      return;
    }
    setWifeLoading(true);
    setWifeError("");
    setWife(null);
    setWeddingDate("");
    setSubmitError("");
    setSubmitSuccess("");
    try {
      const res = await api.post("/family/getmemberprofile", {
        memberId: parseInt(wifeIdInput),
      });
      const profile = res.data?.memberProfile;
      if (profile) {
        setWife(profile);
      } else {
        setWifeError("Member not found.");
      }
    } catch (err) {
      setWifeError(
        err.response?.data?.operationMessage || ERROR_MESSAGES.DEFAULT
      );
    } finally {
      setWifeLoading(false);
    }
  };

  const handleRegisterMarriage = async () => {
    if (!weddingDate) {
      setSubmitError("Please enter the wedding date.");
      return;
    }
    setSubmitLoading(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      const res = await api.post("/family/registerMarriage", {
        husbandId: husband.memberId,
        husbandFirstName: husband.firstName,
        wifeId: wife.memberId,
        wifeFirstName: wife.firstName,
        weddingDate,
      });
      setSubmitSuccess(
        res.data?.operationMessage || "Marriage registered successfully."
      );
    } catch (err) {
      setSubmitError(
        err.response?.data?.operationMessage || ERROR_MESSAGES.DEFAULT
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRegisterAnother = () => {
    setHusbandIdInput("");
    setHusband(null);
    setHusbandError("");
    setWifeIdInput("");
    setWife(null);
    setWifeError("");
    setWeddingDate("");
    setSubmitError("");
    setSubmitSuccess("");
  };

  if (submitSuccess) {
    return (
      <div className="container p-4 bg-white rounded mt-4">
        <SuccessBanner message={submitSuccess} />
        <div className="mt-3">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleRegisterAnother}
          >
            Register another marriage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4 bg-white rounded mt-4">
      <h4 className="mb-4">Register Marriage</h4>

      {/* Step 1: Lookup husband */}
      <div className="card mb-4 p-4 bg-body-secondary border-0">
        <h6 className="fw-semibold mb-3">Step 1: Find Husband</h6>
        <div className="d-flex align-items-center gap-2">
          <input
            type="number"
            className="form-control w-auto"
            placeholder="Enter Member ID"
            value={husbandIdInput}
            onChange={(e) => setHusbandIdInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookupHusband()}
          />
          <button
            className="btn btn-primary"
            onClick={lookupHusband}
            disabled={husbandLoading}
          >
            {husbandLoading ? "Looking up..." : "Look up"}
          </button>
        </div>
        {husbandError && (
          <div className="text-danger mt-2 small">{husbandError}</div>
        )}
        {husband && <MemberCard member={husband} />}
      </div>

      {/* Step 2: Lookup wife */}
      {husband && (
        <div className="card mb-4 p-4 bg-body-secondary border-0">
          <h6 className="fw-semibold mb-3">Step 2: Find Wife</h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              className="form-control w-auto"
              placeholder="Enter Member ID"
              value={wifeIdInput}
              onChange={(e) => setWifeIdInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookupWife()}
            />
            <button
              className="btn btn-primary"
              onClick={lookupWife}
              disabled={wifeLoading}
            >
              {wifeLoading ? "Looking up..." : "Look up"}
            </button>
          </div>
          {wifeError && (
            <div className="text-danger mt-2 small">{wifeError}</div>
          )}
          {wife && <MemberCard member={wife} />}
        </div>
      )}

      {/* Step 3: Wedding date and submit */}
      {husband && wife && (
        <div className="card mb-4 p-4 bg-body-secondary border-0">
          <h6 className="fw-semibold mb-3">Step 3: Enter Wedding Date</h6>
          <div className="d-flex align-items-center gap-2 mb-3">
            <label className="fw-semibold text-nowrap">Wedding Date:</label>
            <input
              type="date"
              className="form-control w-auto"
              value={weddingDate}
              onChange={(e) => {
                setWeddingDate(e.target.value);
                setSubmitError("");
              }}
            />
          </div>

          {weddingDate && (
            <div className="alert alert-info py-2 mb-3">
              Registering marriage between{" "}
              <strong>{husband.firstName} {husband.lastName}</strong> and{" "}
              <strong>{wife.firstName} {wife.lastName}</strong> on{" "}
              <strong>{weddingDate}</strong>
            </div>
          )}

          {submitError && <FailureBanner message={submitError} />}

          {weddingDate && (
            <button
              className="btn btn-success fw-bold"
              onClick={handleRegisterMarriage}
              disabled={submitLoading}
            >
              {submitLoading ? "Registering..." : "Register Marriage"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RegisterMarriage;
