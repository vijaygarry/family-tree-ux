import { useState } from "react";
import api from "../api/axiosInstance";
import ERROR_MESSAGES from "../constants/messages";
import { SuccessBanner, FailureBanner } from "../components/AlertBanners";

const RELATIONSHIP_OPTIONS_MALE = [
  { value: "", label: "Select Relationship" },
  { value: "Father", label: "Father" },
  { value: "Son", label: "Son" },
];

const RELATIONSHIP_OPTIONS_FEMALE = [
  { value: "", label: "Select Relationship" },
  { value: "Mother", label: "Mother" },
  { value: "Daughter", label: "Daughter" },
];

const RELATIONSHIP_OPTIONS_ALL = [
  { value: "", label: "Select Relationship" },
  { value: "Father", label: "Father" },
  { value: "Mother", label: "Mother" },
  { value: "Son", label: "Son" },
  { value: "Daughter", label: "Daughter" },
];

const getRelationshipOptions = (gender) => {
  if (gender === "Male") return RELATIONSHIP_OPTIONS_MALE;
  if (gender === "Female") return RELATIONSHIP_OPTIONS_FEMALE;
  return RELATIONSHIP_OPTIONS_ALL;
};

const MemberCard = ({ member }) => (
  <div className="d-flex align-items-center gap-3 mt-3 p-3 bg-white rounded border">
    {member.profileImage && (
      <img
        src={member.profileImage}
        alt={`${member.firstName} ${member.lastName}`}
        style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
      />
    )}
    <div>
      <div className="fw-bold">
        {member.firstName} {member.lastName}
      </div>
      <div className="text-muted small">
        ID: {member.memberId} &middot; {member.gender || "—"}
      </div>
    </div>
  </div>
);

const AddRelationship = () => {
  const [memberIdInput, setMemberIdInput] = useState("");
  const [member, setMember] = useState(null);
  const [memberError, setMemberError] = useState("");
  const [memberLoading, setMemberLoading] = useState(false);

  const [relatedMemberIdInput, setRelatedMemberIdInput] = useState("");
  const [relatedMember, setRelatedMember] = useState(null);
  const [relatedMemberError, setRelatedMemberError] = useState("");
  const [relatedMemberLoading, setRelatedMemberLoading] = useState(false);

  const [selectedRelationship, setSelectedRelationship] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const lookupMember = async () => {
    if (!memberIdInput.trim()) {
      setMemberError("Please enter a member ID.");
      return;
    }
    setMemberLoading(true);
    setMemberError("");
    setMember(null);
    setRelatedMember(null);
    setRelatedMemberIdInput("");
    setRelatedMemberError("");
    setSelectedRelationship("");
    setSubmitError("");
    setSubmitSuccess("");
    try {
      const res = await api.post("/family/getmemberprofile", {
        memberId: parseInt(memberIdInput),
      });
      const profile = res.data?.memberProfile;
      if (profile) {
        setMember(profile);
      } else {
        setMemberError("Member not found.");
      }
    } catch (err) {
      setMemberError(
        err.response?.data?.operationMessage || ERROR_MESSAGES.DEFAULT
      );
    } finally {
      setMemberLoading(false);
    }
  };

  const lookupRelatedMember = async () => {
    if (!relatedMemberIdInput.trim()) {
      setRelatedMemberError("Please enter a related member ID.");
      return;
    }
    setRelatedMemberLoading(true);
    setRelatedMemberError("");
    setRelatedMember(null);
    setSelectedRelationship("");
    setSubmitError("");
    setSubmitSuccess("");
    try {
      const res = await api.post("/family/getmemberprofile", {
        memberId: parseInt(relatedMemberIdInput),
      });
      const profile = res.data?.memberProfile;
      if (profile) {
        setRelatedMember(profile);
      } else {
        setRelatedMemberError("Member not found.");
      }
    } catch (err) {
      setRelatedMemberError(
        err.response?.data?.operationMessage || ERROR_MESSAGES.DEFAULT
      );
    } finally {
      setRelatedMemberLoading(false);
    }
  };

  const handleAddRelationship = async () => {
    if (!selectedRelationship) {
      setSubmitError("Please select a relationship.");
      return;
    }
    setSubmitLoading(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      const res = await api.post("/family/addRelationship", {
        memberId: member.memberId,
        relatedMemberId: relatedMember.memberId,
        relationship: selectedRelationship,
      });
      setSubmitSuccess(
        res.data?.operationMessage || "Relationship added successfully."
      );
    } catch (err) {
      setSubmitError(
        err.response?.data?.operationMessage || ERROR_MESSAGES.DEFAULT
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const memberFullName = member
    ? `${member.firstName} ${member.lastName}`
    : "";
  const relatedMemberFullName = relatedMember
    ? `${relatedMember.firstName} ${relatedMember.lastName}`
    : "";

  return (
    <div className="container p-4 bg-white rounded mt-4">
      <h4 className="mb-4">Add Relationship</h4>

      {/* Step 1: Lookup member */}
      <div className="card mb-4 p-4 bg-body-secondary border-0">
        <h6 className="fw-semibold mb-3">Step 1: Find Member</h6>
        <div className="d-flex align-items-center gap-2">
          <input
            type="number"
            className="form-control w-auto"
            placeholder="Enter Member ID"
            value={memberIdInput}
            onChange={(e) => setMemberIdInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookupMember()}
          />
          <button
            className="btn btn-primary"
            onClick={lookupMember}
            disabled={memberLoading}
          >
            {memberLoading ? "Looking up..." : "Look up"}
          </button>
        </div>
        {memberError && (
          <div className="text-danger mt-2 small">{memberError}</div>
        )}
        {member && <MemberCard member={member} />}
      </div>

      {/* Step 2: Lookup related member */}
      {member && (
        <div className="card mb-4 p-4 bg-body-secondary border-0">
          <h6 className="fw-semibold mb-3">Step 2: Find Related Member</h6>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              className="form-control w-auto"
              placeholder="Enter Related Member ID"
              value={relatedMemberIdInput}
              onChange={(e) => setRelatedMemberIdInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookupRelatedMember()}
            />
            <button
              className="btn btn-primary"
              onClick={lookupRelatedMember}
              disabled={relatedMemberLoading}
            >
              {relatedMemberLoading ? "Looking up..." : "Look up"}
            </button>
          </div>
          {relatedMemberError && (
            <div className="text-danger mt-2 small">{relatedMemberError}</div>
          )}
          {relatedMember && <MemberCard member={relatedMember} />}
        </div>
      )}

      {/* Step 3: Select relationship and submit */}
      {member && relatedMember && (
        <div className="card mb-4 p-4 bg-body-secondary border-0">
          <h6 className="fw-semibold mb-3">Step 3: Select Relationship</h6>
          <select
            className="form-select w-auto mb-3"
            value={selectedRelationship}
            onChange={(e) => {
              setSelectedRelationship(e.target.value);
              setSubmitError("");
              setSubmitSuccess("");
            }}
          >
            {getRelationshipOptions(relatedMember.gender).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {selectedRelationship && (
            <div className="alert alert-info py-2 mb-3">
              Adding <strong>{relatedMemberFullName}</strong> as <strong>{memberFullName}'s </strong> 
               {selectedRelationship.toLowerCase()}
              
            </div>
          )}

          {submitError && <FailureBanner message={submitError} />}
          {submitSuccess && <SuccessBanner message={submitSuccess} />}

          {!submitSuccess && (
            <button
              className="btn btn-success fw-bold"
              onClick={handleAddRelationship}
              disabled={!selectedRelationship || submitLoading}
            >
              {submitLoading ? "Adding..." : "Add Relationship"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddRelationship;
