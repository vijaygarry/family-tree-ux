import { useState } from "react";
import api from "../api/axiosInstance";
import ERROR_MESSAGES from "../constants/messages";
import { SuccessBanner, FailureBanner } from "../components/AlertBanners";
import { monthOptions, dayOptions } from "../constants/DropdownConstants";
import { MONTH_TO_NUMBER } from "../utils/formatUtils";

const MarkAsDeceased = () => {
  const [memberIdInput, setMemberIdInput] = useState("");
  const [member, setMember] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [deathDay, setDeathDay] = useState("");
  const [deathMonth, setDeathMonth] = useState("");
  const [deathYear, setDeathYear] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleLookup = async () => {
    if (!memberIdInput) return;
    setLookupError("");
    setMember(null);
    setDeathDay("");
    setDeathMonth("");
    setDeathYear("");
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
    setDeathDay("");
    setDeathMonth("");
    setDeathYear("");
    setSubmitError("");
    setSubmitSuccess("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!deathDay || !deathMonth || !deathYear) {
      setSubmitError("Day, month, and year of death are required.");
      return;
    }

    const mm = MONTH_TO_NUMBER[deathMonth];
    const dd = String(deathDay).padStart(2, "0");
    const dateOfDeath = `${deathYear}-${mm}-${dd}`;

    const memberName = member.firstName;

    setSubmitLoading(true);
    try {
      const res = await api.post("/family/markAsDeceased", {
        memberId: member.memberId,
        memberName,
        familyId: member.familyId,
        dateOfDeath,
      });
      setSubmitSuccess(
        res.data?.operationMessage || "Member marked as deceased successfully."
      );
    } catch (err) {
      setSubmitError(
        err.response?.data?.operationMessage || ERROR_MESSAGES.DEFAULT
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleMarkAnother = () => {
    setMemberIdInput("");
    setMember(null);
    setLookupError("");
    setDeathDay("");
    setDeathMonth("");
    setDeathYear("");
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
            onClick={handleMarkAnother}
          >
            Mark another member
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4 bg-white rounded mt-4">
      <form onSubmit={handleUpdate}>
        {/* Step 1: Member ID lookup */}
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

        {/* Step 2: Member details + date of death */}
        {member && (
          <>
            <div className="card mb-4 p-4 bg-body-secondary border-0">
              <div className="row mb-3">
                <div className="col-sm-3 mb-2">
                  <span className="fw-semibold me-1">Member ID:</span>
                  <span>{member.memberId}</span>
                </div>
                <div className="col-sm-3 mb-2">
                  <span className="fw-semibold me-1">Name:</span>
                  <span>
                    {[member.firstName, member.lastName]
                      .filter(Boolean)
                      .join(" ")}
                  </span>
                </div>
                <div className="col-sm-3 mb-2">
                  <span className="fw-semibold me-1">Family ID:</span>
                  <span>{member.familyId}</span>
                </div>
              </div>

              <hr />

              <div className="row align-items-end">
                <div className="col-12 mb-2">
                  <label className="fw-semibold">
                    Date of Death: <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="col-sm-3 mb-3">
                  <label className="form-label text-muted small mb-1">
                    Day <span className="text-danger">*</span>
                  </label>
                  <select
                    value={deathDay}
                    onChange={(e) => setDeathDay(e.target.value)}
                    className="form-select"
                  >
                    {dayOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-3 mb-3">
                  <label className="form-label text-muted small mb-1">
                    Month <span className="text-danger">*</span>
                  </label>
                  <select
                    value={deathMonth}
                    onChange={(e) => setDeathMonth(e.target.value)}
                    className="form-select"
                    required
                  >
                    {monthOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-3 mb-3">
                  <label className="form-label text-muted small mb-1">
                    Year <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    value={deathYear}
                    onChange={(e) => setDeathYear(e.target.value)}
                    className="form-control"
                    placeholder="e.g. 2024"
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
              </div>

              {submitError && <FailureBanner message={submitError} />}

              <div className="mt-2 text-end">
                <button
                  className="btn btn-primary fw-bold"
                  type="submit"
                  disabled={submitLoading}
                >
                  {submitLoading ? "Updating..." : "Update Member"}
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default MarkAsDeceased;
