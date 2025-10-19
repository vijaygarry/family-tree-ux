import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import ERROR_MESSAGES from "../constants/messages";
import { SuccessBanner, FailureBanner } from "../components/AlertBanners";
import {
  genderOptions,
  maritalStatusOptions,
  monthOptions,
  dayOptions,
  relationshipTypeOptions,
} from "../constants/DropdownConstants";

const AddMember = () => {
  const [memberForm, setMemberForm] = useState({});
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  useEffect(() => {
    setMemberForm({});
    setAddSuccess("");
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("memberAddress.")) {
      setMemberForm((prev) => ({
        ...prev,
        memberAddress: {
          ...prev.memberAddress,
          [name.replace("memberAddress.", "")]: value,
        },
      }));
    }
    if (name.startsWith("relationship.")) {
      setMemberForm((prev) => ({
        ...prev,
        relationship: {
          ...prev.relationship,
          [name.replace("relationship.", "")]: value,
        },
      }));
    } else {
      setMemberForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!memberForm.firstName?.trim()) return "First Name is required.";
    if (!memberForm.gender?.trim()) return "Gender is required.";
    if (!memberForm.maritalStatus?.trim()) return "Marital Status is required.";
    if (!memberForm.birthMonth?.trim()) return "Birth month is required.";
    if (!memberForm.birthYear) return "Birth year is required.";
    if (!memberForm.addressSameAsFamily) {
      if (!memberForm.memberAddress?.addressLine1?.trim())
        return "Address Line 1 is required.";
      if (!memberForm.memberAddress?.city?.trim()) return "City is required.";
      if (!memberForm.memberAddress?.state?.trim()) return "State is required.";
      if (!memberForm.memberAddress?.postalCode?.trim())
        return "Postal Code is required.";
      if (!memberForm.memberAddress?.country?.trim())
        return "Country is required.";
    }
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
      const response = await api.post("/family/addFamilyMember", {
        ...memberForm,
      });
      setMemberForm({});
      if (response?.data?.operationMessage) {
        setAddSuccess(response?.data?.operationMessage);
      } else {
        setAddSuccess("Member profile added successfully.");
      }
    } catch (err) {
      if (err.response?.data?.operationMessage) {
        // API returned an error in payload
        setAddError(err.response?.data?.operationMessage);
      } else {
        setAddError(ERROR_MESSAGES.DEFAULT);
      }
    }
  };

  const addMemberForm = (
    <form onSubmit={handleSave}>
      {/* Member Profile Section */}
      <div className="row">
        <h5 className="mb-3 float-start">
          {(() => {
            const rel = memberForm.relationship?.relationshipType || "";
            const name =
              memberForm.relationship?.memberName || "Related Member";
            if (!rel) return `Add a member to ${name}`;
            // use lowercase for relationship in sentence, but keep label casing for options like 'Son'
            return `Add ${name}'s ${rel.toLowerCase()}`;
          })()}
        </h5>
      </div>
      {addError && <FailureBanner message={addError} />}
      <div className="card mb-5 p-4 bg-body-secondary border-0">
        <div className="row">
          <div className="col-sm-4">
            <input
              id="headOfFamily"
              name="headOfFamily"
              type="checkbox"
              className="mb-1"
              checked={!!memberForm.headOfFamily}
              onChange={(e) =>
                setMemberForm((prev) => ({
                  ...prev,
                  headOfFamily: e.target.checked,
                }))
              }
              placeholder="Head Of Family"
            />
            <label className="fw-semibold ms-2">Head Of Family</label>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <span className="fw-semibold me-2">
              Current Family Id: <span className="text-danger">*</span>
            </span>
            <input
              name="familyId"
              value={memberForm.familyId || ""}
              onChange={handleFormChange}
              className="form-control d-inline w-auto"
              placeholder="Family Id"
              required
            />
          </div>
        </div>
        {!memberForm.headOfFamily && (
          <div className="row">
            <div className="col-sm-4">
              <span className="fw-semibold me-2">
                Current Member Id: <span className="text-danger">*</span>
              </span>
              <input
                name="relationship.memberId"
                value={memberForm.relationship?.memberId || ""}
                onChange={handleFormChange}
                className="form-control d-inline w-auto"
                placeholder="Related Member Id"
                required
              />
            </div>
            <div className="col-sm-4">
              <span className="fw-semibold me-2">Selected Member Name </span>
              <input
                name="relationship.memberName"
                value={memberForm.relationship?.memberName || ""}
                onChange={handleFormChange}
                className="form-control d-inline w-auto"
                placeholder="Related Member First Name"
              />
            </div>
            <div className="col-sm-4">
              <span className="fw-semibold me-2">Relationship Type: </span>
              <select
                name="relationship.relationshipType"
                value={memberForm.relationship?.relationshipType || ""}
                onChange={handleFormChange}
                className="form-select"
                required
                placeholder="Relationship Type"
              >
                {relationshipTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-sm-4">
            <span className="fw-semibold me-2">
              First Name: <span className="text-danger">*</span>
            </span>
            <input
              name="firstName"
              value={memberForm.firstName || ""}
              onChange={handleFormChange}
              className="form-control d-inline w-auto"
              placeholder="First Name"
              required
            />
          </div>
          <div className="col-sm-4">
            <span className="fw-semibold me-2">First Name (Hindi): </span>
            <input
              name="firstNameInHindi"
              value={memberForm.firstNameInHindi || ""}
              onChange={handleFormChange}
              className="form-control d-inline w-auto"
              placeholder="First Name in Hindi"
            />
          </div>
          <div className="col-sm-4">
            <span className="fw-semibold me-2">Maiden Last Name: </span>
            <input
              name="maidenLastName"
              value={memberForm.maidenLastName || ""}
              onChange={handleFormChange}
              className="form-control d-inline w-auto"
              placeholder="Maiden Last Name"
            />
          </div>
          <div className="col-sm-4">
            <span className="fw-semibold me-2">Nick Name: </span>
            <input
              name="nickName"
              value={memberForm.nickName || ""}
              onChange={handleFormChange}
              className="form-control d-inline w-auto"
              placeholder="Nick Name"
            />
          </div>
          <div className="col-sm-4">
            <span className="fw-semibold me-2">Nick Name (Hindi): </span>
            <input
              name="nickNameInHindi"
              value={memberForm.nickNameInHindi || ""}
              onChange={handleFormChange}
              className="form-control d-inline w-auto"
              placeholder="Nick Name in Hindi"
            />
          </div>
          <div className="col-sm-4">
            <span className="fw-semibold me-2">Phone: </span>
            <input
              name="phone"
              value={memberForm.phone || ""}
              onChange={handleFormChange}
              className="form-control d-inline w-auto"
              placeholder="Phone"
            />
          </div>
          <div className="col-sm-4">
            <span className="fw-semibold me-2">
              Gender: <span className="text-danger">*</span>
            </span>
            <select
              name="gender"
              value={memberForm.gender || ""}
              onChange={handleFormChange}
              className="form-select"
              required
              placeholder="Gender"
            >
              {genderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-4">
            <span className="fw-semibold me-2">
              Marital Status: <span className="text-danger">*</span>
            </span>
            <select
              name="maritalStatus"
              value={memberForm.maritalStatus || ""}
              onChange={handleFormChange}
              className="form-select"
              required
              placeholder="Marital Status"
            >
              {maritalStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-4">
            <span className="fw-semibold me-2">Wedding Date: </span>
            <input
              name="weddingDate"
              type="date"
              value={memberForm.weddingDate || ""}
              onChange={handleFormChange}
              className="form-control d-inline w-auto"
              placeholder="Wedding Date"
            />
          </div>

          <div className="col-sm-4">
            <span className="fw-semibold me-2">Birth Day: </span>
            <select
              name="birthDay"
              value={memberForm.birthDay || ""}
              onChange={handleFormChange}
              className="form-select"
              placeholder="Birth Day"
            >
              {dayOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-4">
            <span className="fw-semibold me-2">
              Birth Month: <span className="text-danger">*</span>
            </span>
            <select
              name="birthMonth"
              value={memberForm.birthMonth || ""}
              onChange={handleFormChange}
              className="form-select"
              required
              placeholder="Birth Month"
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-4">
            <span className="fw-semibold me-2">
              Birth Year: <span className="text-danger">*</span>
            </span>
            <input
              name="birthYear"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={memberForm.birthYear || ""}
              onChange={handleFormChange}
              className="form-control d-inline w-auto"
              required
              placeholder="Birth Year"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-4">
            <span className="fw-semibold me-2">Email: </span>
            <input
              name="email"
              type="email"
              value={memberForm.email || ""}
              onChange={handleFormChange}
              className="form-control d-inline w-auto"
              placeholder="Email"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <span className="fw-semibold me-2">Education Details: </span>
            <input
              name="educationDetails"
              value={memberForm.educationDetails || ""}
              onChange={handleFormChange}
              className="form-control d-inline w-auto"
              placeholder="Education Details"
            />
          </div>
          <div className="col-sm-4">
            <span className="fw-semibold me-2">Occupation: </span>
            <input
              name="occupation"
              value={memberForm.occupation || ""}
              onChange={handleFormChange}
              className="form-control d-inline w-auto"
              placeholder="Occupation"
            />
          </div>
        </div>

        <div className="d-flex">
          <span className="fw-semibold me-2">Member Address:</span>
          <div className="row">
            <div className="col-sm-4">
              <input
                type="checkbox"
                id="addressSameAsFamily"
                checked={memberForm.addressSameAsFamily || false}
                onChange={(e) =>
                  setMemberForm((prev) => ({
                    ...prev,
                    addressSameAsFamily: e.target.checked,
                  }))
                }
                className="mb-1"
                placeholder="Same as family address"
              />
              <label className="fw-semibold ms-2">
                Member's address is same as family address
              </label>
            </div>
          </div>
          {!memberForm.addressSameAsFamily && (
            <div className="d-flex">
              <div className="row">
                <div className="col-sm-4">
                  <span className="fw-semibold me-2">
                    Address Line 1: <span className="text-danger">*</span>
                  </span>
                  <input
                    name="memberAddress.addressLine1"
                    value={memberForm.memberAddress?.addressLine1 || ""}
                    onChange={handleFormChange}
                    className="form-control mb-1"
                    placeholder="Address Line 1"
                  />
                </div>
                <div className="col-sm-4">
                  <span className="fw-semibold me-2">Address Line 2: </span>
                  <input
                    name="memberAddress.addressLine2"
                    value={memberForm.memberAddress?.addressLine2 || ""}
                    onChange={handleFormChange}
                    className="form-control mb-1"
                    placeholder="Address Line 2"
                  />
                </div>
                <div className="col-sm-4">
                  <span className="fw-semibold me-2">Address Line 3: </span>
                  <input
                    name="memberAddress.addressLine3"
                    value={memberForm.memberAddress?.addressLine3 || ""}
                    onChange={handleFormChange}
                    className="form-control mb-1"
                    placeholder="Address Line 3"
                  />
                </div>
                <div className="col-sm-4">
                  <span className="fw-semibold me-2">District: </span>
                  <input
                    name="memberAddress.district"
                    value={memberForm.memberAddress?.district || ""}
                    onChange={handleFormChange}
                    className="form-control mb-1"
                    placeholder="District"
                  />
                </div>
                <div className="col-sm-4">
                  <span className="fw-semibold me-2">
                    City: <span className="text-danger">*</span>
                  </span>
                  <input
                    name="memberAddress.city"
                    value={memberForm.memberAddress?.city || ""}
                    onChange={handleFormChange}
                    className="form-control mb-1"
                    placeholder="City"
                  />
                </div>
                <div className="col-sm-4">
                  <span className="fw-semibold me-2">
                    State: <span className="text-danger">*</span>
                  </span>
                  <input
                    name="memberAddress.state"
                    value={memberForm.memberAddress?.state || ""}
                    onChange={handleFormChange}
                    className="form-control mb-1"
                    placeholder="State"
                  />
                </div>
                <div className="col-sm-4">
                  <span className="fw-semibold me-2">
                    Postal Code: <span className="text-danger">*</span>
                  </span>
                  <input
                    name="memberAddress.postalCode"
                    value={memberForm.memberAddress?.postalCode || ""}
                    onChange={handleFormChange}
                    className="form-control mb-1"
                    placeholder="Postal Code"
                  />
                </div>
                <div className="col-sm-4">
                  <span className="fw-semibold me-2">
                    Country: <span className="text-danger">*</span>
                  </span>
                  <input
                    name="memberAddress.country"
                    value={memberForm.memberAddress?.country || ""}
                    onChange={handleFormChange}
                    className="form-control mb-1"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 text-end">
          <button className="btn btn-primary fw-bold me-2" type="submit">
            Save
          </button>
          {/* <button className="btn btn-outline-primary btn-sm" type="button" onClick={handleCancelEdit}>Cancel</button> */}
        </div>
      </div>
    </form>
  );

  const showSuccessMsg = (
    <div>
      <SuccessBanner message={addSuccess} />
    </div>
  );

  return (
    <div className="container p-4 bg-white rounded mt-4">
      <div
        className="card-body d-flex flex-wrap align-items-start p-0"
        style={{ gap: "1rem" }}
      >
        {addSuccess ? showSuccessMsg : addMemberForm}
      </div>
    </div>
  );
};

export default AddMember;
