import { useState } from "react";
import api from "../api/axiosInstance";
import ERROR_MESSAGES from "../constants/messages";
import { SuccessBanner, FailureBanner } from "../components/AlertBanners";
import {
  genderOptions,
  maritalStatusOptions,
  monthOptions,
  dayOptions,
} from "../constants/DropdownConstants";

const relationshipsByGender = {
  Male: [
    { value: "", label: "Select Relationship" },
    { value: "Father", label: "Father" },
    { value: "Mother", label: "Mother" },
    { value: "Son", label: "Son" },
    { value: "Daughter", label: "Daughter" },
    { value: "Wife", label: "Wife" },
  ],
  Female: [
    { value: "", label: "Select Relationship" },
    { value: "Father", label: "Father" },
    { value: "Mother", label: "Mother" },
    { value: "Son", label: "Son" },
    { value: "Daughter", label: "Daughter" },
    { value: "Husband", label: "Husband" },
  ],
};

const genderByRelationship = {
  Father: "Male",
  Mother: "Female",
  Son: "Male",
  Daughter: "Female",
  Wife: "Female",
  Husband: "Male",
};

const AddMember = () => {
  const [memberIdInput, setMemberIdInput] = useState("");
  const [relatedMember, setRelatedMember] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState("");
  const [memberForm, setMemberForm] = useState({});
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const handleLookup = async () => {
    if (!memberIdInput) return;
    setLookupError("");
    setRelatedMember(null);
    setSelectedRelationship("");
    setMemberForm({});
    setAddError("");
    setLookupLoading(true);
    try {
      const res = await api.post("/family/getmemberprofile", {
        memberId: parseInt(memberIdInput),
      });
      const profile = res.data?.memberProfile;
      if (!profile) {
        setLookupError("Member not found.");
      } else {
        setRelatedMember(profile);
      }
    } catch (err) {
      if (err.response?.data?.operationMessage) {
        setLookupError(err.response.data.operationMessage);
      } else {
        setLookupError("Member not found.");
      }
    } finally {
      setLookupLoading(false);
    }
  };

  const handleMemberIdKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLookup();
    }
  };

  const resetLookup = () => {
    setRelatedMember(null);
    setSelectedRelationship("");
    setMemberForm({});
    setLookupError("");
    setAddError("");
  };

  const handleRelationshipChange = (e) => {
    const rel = e.target.value;
    setSelectedRelationship(rel);
    if (rel) {
      const impliedGender = genderByRelationship[rel] || "";
      setMemberForm((prev) => ({
        ...prev,
        gender: impliedGender,
        familyId: relatedMember?.familyId || prev.familyId || "",
        relationship: {
          memberId: relatedMember?.memberId,
          memberName: relatedMember?.firstName || "",
          relationshipType: rel,
        },
      }));
    } else {
      setMemberForm({});
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setMemberForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!memberForm.firstName?.trim()) return "First Name is required.";
    if (!memberForm.gender?.trim()) return "Gender is required.";
    if (!memberForm.maritalStatus?.trim()) return "Marital Status is required.";
    if (!memberForm.birthMonth?.trim()) return "Birth month is required.";
    if (!memberForm.birthYear) return "Birth year is required.";
    return "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");
    const validationMsg = validateForm();
    if (validationMsg) {
      setAddError(validationMsg);
      return;
    }
    try {
      const response = await api.post("/family/addFamilyMember", { ...memberForm, addressSameAsFamily: true });
      setMemberForm({});
      setAddSuccess(response?.data?.operationMessage || "Member profile added successfully.");
    } catch (err) {
      setAddError(err.response?.data?.operationMessage || ERROR_MESSAGES.DEFAULT);
    }
  };

  const relatedMemberName = relatedMember
    ? [relatedMember.firstName, relatedMember.lastName].filter(Boolean).join(" ")
    : "";

  const availableRelationships =
    relatedMember?.gender && relationshipsByGender[relatedMember.gender]
      ? relationshipsByGender[relatedMember.gender]
      : [
          { value: "", label: "Select Relationship" },
          ...Object.keys(genderByRelationship).map((r) => ({ value: r, label: r })),
        ];

  const showMainForm = !!relatedMember && !!selectedRelationship;

  const handleAddAnotherRelated = () => {
    setSelectedRelationship("");
    setMemberForm({});
    setAddSuccess("");
    setAddError("");
  };

  const handleAddOtherMember = () => {
    setMemberIdInput("");
    setRelatedMember(null);
    setSelectedRelationship("");
    setMemberForm({});
    setAddSuccess("");
    setAddError("");
    setLookupError("");
  };

  if (addSuccess) {
    return (
      <div className="container p-4 bg-white rounded mt-4">
        <SuccessBanner message={addSuccess} />
        <div className="d-flex gap-2 mt-3">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleAddAnotherRelated}
          >
            Add another related member
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleAddOtherMember}
          >
            Add other member
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4 bg-white rounded mt-4">
      <form onSubmit={handleSave}>
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
                if (relatedMember) resetLookup();
              }}
              onKeyDown={handleMemberIdKeyDown}
              className="form-control"
              style={{ width: "140px" }}
              placeholder="Enter Member ID"
              disabled={!!relatedMember}
              type="number"
            />
            {!relatedMember ? (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={handleLookup}
                disabled={lookupLoading || !memberIdInput}
              >
                {lookupLoading ? "Looking up..." : "Find Member"}
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

        {/* Step 2: Show member info + relationship dropdown */}
        {relatedMember && (
          <div className="row mb-3 align-items-center">
            <div className="col-sm-3">
              <span className="fw-semibold me-1">First Name:</span>
              <span>{relatedMember.firstName}</span>
            </div>
            <div className="col-sm-3">
              <span className="fw-semibold me-1">Last Name:</span>
              <span>{relatedMember.lastName}</span>
            </div>
            <div className="col-sm-2">
              <span className="fw-semibold me-1">Family ID:</span>
              <span>{relatedMember.familyId}</span>
            </div>
            <div className="col-sm-4 d-flex align-items-center gap-2">
              <span className="fw-semibold text-nowrap">Relationship:</span>
              <select
                value={selectedRelationship}
                onChange={handleRelationshipChange}
                className="form-select"
              >
                {availableRelationships.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Full form after relationship selected */}
        {showMainForm && (
          <>
            <div className="row">
              <h5 className="mb-3">
                Adding {relatedMemberName}&apos;s {selectedRelationship.toLowerCase()}
              </h5>
            </div>
            {addError && <FailureBanner message={addError} />}
            <div className="card mb-5 p-4 bg-body-secondary border-0">
              <div className="row">
                <div className="col-sm-4 mb-3">
                  <label className="fw-semibold d-block mb-1">
                    First Name: <span className="text-danger">*</span>
                  </label>
                  <input
                    name="firstName"
                    value={memberForm.firstName || ""}
                    onChange={handleFormChange}
                    className="form-control"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="col-sm-4 mb-3">
                  <label className="fw-semibold d-block mb-1">First Name (Hindi):</label>
                  <input
                    name="firstNameInHindi"
                    value={memberForm.firstNameInHindi || ""}
                    onChange={handleFormChange}
                    className="form-control"
                    placeholder="First Name in Hindi"
                  />
                </div>
                <div className="col-sm-4 mb-3">
                  <label className="fw-semibold d-block mb-1">Maiden Last Name:</label>
                  <input
                    name="maidenLastName"
                    value={memberForm.maidenLastName || ""}
                    onChange={handleFormChange}
                    className="form-control"
                    placeholder="Maiden Last Name"
                  />
                </div>
                <div className="col-sm-4 mb-3">
                  <label className="fw-semibold d-block mb-1">Nick Name:</label>
                  <input
                    name="nickName"
                    value={memberForm.nickName || ""}
                    onChange={handleFormChange}
                    className="form-control"
                    placeholder="Nick Name"
                  />
                </div>
                <div className="col-sm-4 mb-3">
                  <label className="fw-semibold d-block mb-1">Nick Name (Hindi):</label>
                  <input
                    name="nickNameInHindi"
                    value={memberForm.nickNameInHindi || ""}
                    onChange={handleFormChange}
                    className="form-control"
                    placeholder="Nick Name in Hindi"
                  />
                </div>
                <div className="col-sm-4 mb-3">
                  <label className="fw-semibold d-block mb-1">Phone:</label>
                  <input
                    name="phone"
                    value={memberForm.phone || ""}
                    onChange={handleFormChange}
                    className="form-control"
                    placeholder="Phone"
                  />
                </div>
                <div className="col-sm-4 mb-3">
                  <label className="fw-semibold d-block mb-1">
                    Gender: <span className="text-danger">*</span>
                  </label>
                  <select
                    name="gender"
                    value={memberForm.gender || ""}
                    onChange={handleFormChange}
                    className="form-select"
                    required
                    disabled
                  >
                    {genderOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-4 mb-3">
                  <label className="fw-semibold d-block mb-1">
                    Marital Status: <span className="text-danger">*</span>
                  </label>
                  <select
                    name="maritalStatus"
                    value={memberForm.maritalStatus || ""}
                    onChange={handleFormChange}
                    className="form-select"
                    required
                  >
                    {maritalStatusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-4 mb-3">
                  <label className="fw-semibold d-block mb-1">Wedding Date:</label>
                  <input
                    name="weddingDate"
                    type="date"
                    value={memberForm.weddingDate || ""}
                    onChange={handleFormChange}
                    className="form-control"
                  />
                </div>
                <div className="col-sm-4 mb-3">
                  <label className="fw-semibold d-block mb-1">Birth Day:</label>
                  <select
                    name="birthDay"
                    value={memberForm.birthDay || ""}
                    onChange={handleFormChange}
                    className="form-select"
                  >
                    {dayOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-4 mb-3">
                  <label className="fw-semibold d-block mb-1">
                    Birth Month: <span className="text-danger">*</span>
                  </label>
                  <select
                    name="birthMonth"
                    value={memberForm.birthMonth || ""}
                    onChange={handleFormChange}
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
                <div className="col-sm-4 mb-3">
                  <label className="fw-semibold d-block mb-1">
                    Birth Year: <span className="text-danger">*</span>
                  </label>
                  <input
                    name="birthYear"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={memberForm.birthYear || ""}
                    onChange={handleFormChange}
                    className="form-control"
                    required
                    placeholder="Birth Year"
                  />
                </div>
                <div className="col-sm-4 mb-3">
                  <label className="fw-semibold d-block mb-1">Email:</label>
                  <input
                    name="email"
                    type="email"
                    value={memberForm.email || ""}
                    onChange={handleFormChange}
                    className="form-control"
                    placeholder="Email"
                  />
                </div>
                <div className="col-sm-4 mb-3">
                  <label className="fw-semibold d-block mb-1">Education Details:</label>
                  <input
                    name="educationDetails"
                    value={memberForm.educationDetails || ""}
                    onChange={handleFormChange}
                    className="form-control"
                    placeholder="Education Details"
                  />
                </div>
                <div className="col-sm-4 mb-3">
                  <label className="fw-semibold d-block mb-1">Occupation:</label>
                  <input
                    name="occupation"
                    value={memberForm.occupation || ""}
                    onChange={handleFormChange}
                    className="form-control"
                    placeholder="Occupation"
                  />
                </div>
              </div>
              <div className="mt-3 text-end">
                <button className="btn btn-primary fw-bold me-2" type="submit">
                  Save
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default AddMember;
