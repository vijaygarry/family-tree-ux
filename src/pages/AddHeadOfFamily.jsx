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

const AddHeadOfFamily = () => {
  const [familyIdInput, setFamilyIdInput] = useState("");
  const [familyDetails, setFamilyDetails] = useState(null);
  const [hasMembers, setHasMembers] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [memberForm, setMemberForm] = useState({});
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const handleLookup = async () => {
    if (!familyIdInput) return;
    setLookupError("");
    setFamilyDetails(null);
    setHasMembers(false);
    setMemberForm({});
    setAddError("");
    setLookupLoading(true);
    try {
      const res = await api.post("/family/getfamilydetails", {
        familyId: parseInt(familyIdInput),
      });
      const family = res.data?.familyDetails || res.data;
      if (!family) {
        setLookupError("Family not found.");
      } else {
        setFamilyDetails(family);
        const members = family.members || [];
        setHasMembers(members.length > 0);
        if (members.length === 0) {
          setMemberForm({ familyId: parseInt(familyIdInput) });
        }
      }
    } catch (err) {
      if (err.response?.data?.operationMessage) {
        setLookupError(err.response.data.operationMessage);
      } else {
        setLookupError("Family not found.");
      }
    } finally {
      setLookupLoading(false);
    }
  };

  const handleFamilyIdKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLookup();
    }
  };

  const resetLookup = () => {
    setFamilyDetails(null);
    setHasMembers(false);
    setMemberForm({});
    setLookupError("");
    setAddError("");
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
      const { relationship, ...formWithoutRelationship } = memberForm;
      const payload = { ...formWithoutRelationship, headOfFamily: true, addressSameAsFamily: true };
      const response = await api.post("/family/addFamilyMember", payload);
      setMemberForm({});
      setAddSuccess(response?.data?.operationMessage || "Head of family added successfully.");
    } catch (err) {
      setAddError(err.response?.data?.operationMessage || ERROR_MESSAGES.DEFAULT);
    }
  };

  const handleAddAnotherFamily = () => {
    setFamilyIdInput("");
    setFamilyDetails(null);
    setHasMembers(false);
    setMemberForm({});
    setAddSuccess("");
    setAddError("");
    setLookupError("");
  };

  if (addSuccess) {
    return (
      <div className="container p-4 bg-white rounded mt-4">
        <SuccessBanner message={addSuccess} />
        <div className="mt-3">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleAddAnotherFamily}
          >
            Add head of family for another family
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4 bg-white rounded mt-4">
      <form onSubmit={handleSave}>
        {/* Step 1: Family ID lookup */}
        <div className="row mb-3">
          <div className="col-auto d-flex align-items-center gap-2">
            <label className="fw-semibold text-nowrap">
              Family ID: <span className="text-danger">*</span>
            </label>
            <input
              value={familyIdInput}
              onChange={(e) => {
                setFamilyIdInput(e.target.value);
                if (familyDetails) resetLookup();
              }}
              onKeyDown={handleFamilyIdKeyDown}
              className="form-control"
              style={{ width: "140px" }}
              placeholder="Enter Family ID"
              disabled={!!familyDetails}
              type="number"
            />
            {!familyDetails ? (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={handleLookup}
                disabled={lookupLoading || !familyIdInput}
              >
                {lookupLoading ? "Looking up..." : "Lookup"}
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

        {/* Step 2: Show family info */}
        {familyDetails && (
          <div className="row mb-3 align-items-center">
            <div className="col-sm-4">
              <span className="fw-semibold me-1">Family ID:</span>
              <span>{familyDetails.familyId || familyIdInput}</span>
            </div>
            {familyDetails.familyName && (
              <div className="col-sm-4">
                <span className="fw-semibold me-1">Family Name:</span>
                <span>{familyDetails.familyName}</span>
              </div>
            )}
            {familyDetails.city && (
              <div className="col-sm-4">
                <span className="fw-semibold me-1">City:</span>
                <span>{familyDetails.city}</span>
              </div>
            )}
          </div>
        )}

        {/* Family already has members */}
        {familyDetails && hasMembers && (
          <div className="alert alert-warning mt-2">
            This family already has members. Head of family cannot be added here.
          </div>
        )}

        {/* Step 3: Member form when family has no members */}
        {familyDetails && !hasMembers && (
          <>
            <div className="row">
              <h5 className="mb-3">Add Head of Family</h5>
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

export default AddHeadOfFamily;
