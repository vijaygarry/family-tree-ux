import { useState } from "react";
import api from "../api/axiosInstance";
import ERROR_MESSAGES from "../constants/messages";
import { SuccessBanner, FailureBanner } from "../components/AlertBanners";

const SetHeadOfFamily = () => {
  const [memberIdInput, setMemberIdInput] = useState("");
  const [member, setMember] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleLookup = async () => {
    if (!memberIdInput) return;
    setLookupError("");
    setMember(null);
    setSubmitError("");
    setSubmitSuccess("");
    setLookupLoading(true);
    try {
      const res = await api.post("/family/getmemberprofile", {
        memberId: parseInt(memberIdInput),
      });
      const profile = res.data?.memberProfile;
      if (!profile) {
        setLookupError("Member not found.");
      } else {
        setMember(profile);
      }
    } catch (err) {
      setLookupError(
        err.response?.data?.operationMessage || "Member not found."
      );
    } finally {
      setLookupLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLookup();
    }
  };

  const resetLookup = () => {
    setMember(null);
    setLookupError("");
    setSubmitError("");
    setSubmitSuccess("");
  };

  const handleSetHead = async () => {
    setSubmitError("");
    setSubmitSuccess("");
    setSubmitLoading(true);
    try {
      const memberName = member.firstName;
      const res = await api.post("/family/setHeadOfFamily", {
        familyId: member.familyId,
        familyName: member.lastName || "",
        memberId: member.memberId,
        memberName,
      });
      setSubmitSuccess(
        res.data?.operationMessage || "Member set as Head of Family successfully."
      );
    } catch (err) {
      setSubmitError(
        err.response?.data?.operationMessage || ERROR_MESSAGES.DEFAULT
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSetAnother = () => {
    setMemberIdInput("");
    setMember(null);
    setLookupError("");
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
            onClick={handleSetAnother}
          >
            Set another member
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4 bg-white rounded mt-4">
      <div className="row mb-3">
        <div className="col-auto d-flex align-items-center gap-2">
          <label className="fw-semibold text-nowrap">
            Member ID: <span className="text-danger">*</span>
          </label>
          <input
            value={memberIdInput}
            onChange={(e) => {
              setMemberIdInput(e.target.value);
              if (member) resetLookup();
            }}
            onKeyDown={handleKeyDown}
            className="form-control"
            style={{ width: "140px" }}
            placeholder="Enter Member ID"
            disabled={!!member}
            type="number"
          />
          {!member ? (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={handleLookup}
              disabled={lookupLoading || !memberIdInput}
            >
              {lookupLoading ? "Looking up..." : "Submit"}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={resetLookup}
            >
              Change
            </button>
          )}
        </div>
      </div>

      {lookupError && <FailureBanner message={lookupError} />}

      {member && (
        <div className="card mb-4 p-4 bg-body-secondary border-0">
          <div className="row mb-3">
            <div className="col-sm-3 mb-2">
              <span className="fw-semibold me-1">Member ID:</span>
              <span>{member.memberId}</span>
            </div>
            <div className="col-sm-3 mb-2">
              <span className="fw-semibold me-1">Name:</span>
              <span>
                {[member.firstName, member.lastName].filter(Boolean).join(" ")}
              </span>
            </div>
            <div className="col-sm-3 mb-2">
              <span className="fw-semibold me-1">Family ID:</span>
              <span>{member.familyId}</span>
            </div>
          </div>

          {submitError && <FailureBanner message={submitError} />}

          <div className="mt-2">
            <button
              className="btn btn-primary fw-bold"
              type="button"
              onClick={handleSetHead}
              disabled={submitLoading}
            >
              {submitLoading ? "Updating..." : "Set member as Head Of Family"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetHeadOfFamily;
