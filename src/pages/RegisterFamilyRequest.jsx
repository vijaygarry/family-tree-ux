import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import ERROR_MESSAGES from "../constants/messages";
import {
  genderOptions,
  maritalStatusOptions,
  monthOptions,
  dayOptions,
} from "../constants/DropdownConstants";
import { countryOptions, indiaStates } from "../constants/addressOptions";
import AutoSuggest from "../components/AutoSuggest";
import { SuccessBanner, FailureBanner } from "../components/AlertBanners";
import { isValidEmail, isValidPhoneNumber } from "../utils/validationUtils";

const RegisterFamilyRequest = () => {
  // wizard step ("family" -> collect family details, "members" -> add members)
  const [step, setStep] = useState("family");

  // family form state + validation error
  const [familyForm, setFamilyForm] = useState({});
  const [familyError, setFamilyError] = useState("");

  // members state and current editing/adding member
  const [members, setMembers] = useState([]);
  const [currentMember, setCurrentMember] = useState({});
  const [memberError, setMemberError] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [showMemberForm, setShowMemberForm] = useState(true);

  // submission status
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submissionDetails, setSubmissionDetails] = useState(null); // { surname, familyRegistrationId }

  useEffect(() => {
    // reset everything when component mounts
    setFamilyForm({});
    setFamilyError("");
    setMembers([]);
    setCurrentMember({ headOfFamily: true, relationship: {} });
    setMemberError("");
    setEditingIndex(-1);
    setShowMemberForm(true);
    setSubmitSuccess("");
    setSubmitError("");
    setSubmissionDetails(null);
  }, []);

  const handleFamilyChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("familyAddress.")) {
      setFamilyForm((prev) => ({
        ...prev,
        familyAddress: {
          ...prev.familyAddress,
          [name.replace("familyAddress.", "")]: value,
        },
      }));
    } else {
      setFamilyForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateFamily = () => {
    if (!familyForm.surname?.trim()) return "Surname is required.";
    //if (!familyForm.gotra?.trim()) return "Gotra is required.";
    if (!familyForm.familyAddress?.addressLine1?.trim())
      return "Address Line 1 is required.";
    if (!familyForm.familyAddress?.city?.trim()) return "City is required.";
    if (!familyForm.familyAddress?.state?.trim()) return "State is required.";
    if (!familyForm.familyAddress?.postalCode?.trim())
      return "Postal Code is required.";
    if (!familyForm.familyAddress?.country?.trim())
      return "Country is required.";
    if (!isValidEmail(familyForm.email))
      return "Invalid email address.";
    if (!isValidPhoneNumber(familyForm.phone))
      return "Invalid phone number. Use international format e.g. +91XXXXXXXXXX.";
    return "";
  };

  const handleFamilyNext = (e) => {
    e.preventDefault();
    setFamilyError("");
    const msg = validateFamily();
    if (msg) {
      setFamilyError(msg);
      return;
    }
    setStep("members");
    setShowMemberForm(true);
  };

  const handleMemberChange = (e) => {
    const { name, value } = e.target;
    // handle relationship sub-fields specially
    if (name.startsWith("relationship.")) {
      const field = name.replace("relationship.", "");
      const fieldValue = field === "memberIndex" ? (value === "" ? "" : Number(value)) : value;
      setCurrentMember((prev) => ({
        ...prev,
        relationship: {
          ...prev.relationship,
          [field]: fieldValue,
        },
      }));
    } else if (name === "gender" && !currentMember.headOfFamily) {
      // changing gender invalidates previous relationship options
      setCurrentMember((prev) => ({ ...prev, gender: value, relationship: {} }));
    } else {
      setCurrentMember((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateMember = () => {
    if (!currentMember.firstName?.trim()) return "First Name is required.";
    if (!currentMember.gender?.trim()) return "Gender is required.";
    if (!currentMember.maritalStatus?.trim())
      return "Marital Status is required.";
    if (!currentMember.birthMonth?.trim())
      return "Birth month is required.";
    if (!currentMember.birthYear) return "Birth year is required.";
    if (!currentMember.headOfFamily) {
      if (!currentMember.relationship?.relationshipType?.trim())
        return "Relationship is required.";
      if (
        currentMember.relationship?.memberIndex === undefined ||
        currentMember.relationship?.memberIndex === null ||
        currentMember.relationship?.memberIndex === ""
      )
        return "Related member is required.";
    }

    if (!isValidPhoneNumber(currentMember.phoneNumber))
      return "Invalid phone number.";
    const trimmedPhone = currentMember.phoneNumber?.trim();
    if (trimmedPhone) {
      const duplicatePhone = members.some(
        (m, idx) =>
          idx !== editingIndex &&
          m.phoneNumber?.trim() === trimmedPhone
      );
      if (duplicatePhone) return "Phone number must be unique for every member.";
    }

    if (!isValidEmail(currentMember.email))
      return "Invalid email address.";
    const trimmedEmail = currentMember.email?.trim();
    if (trimmedEmail) {
      const duplicateEmail = members.some(
        (m, idx) =>
          idx !== editingIndex &&
          m.email?.trim().toLowerCase() === trimmedEmail.toLowerCase()
      );
      if (duplicateEmail) return "Email must be unique for every member.";
    }

    return "";
  };

  const handleMemberSave = (e) => {
    e.preventDefault();
    setMemberError("");
    const msg = validateMember();
    if (msg) {
      setMemberError(msg);
      return;
    }
    const toSave = { ...currentMember };
    // ensure boolean for headOfFamily
    toSave.headOfFamily = !!toSave.headOfFamily;
    if (toSave.relationship?.memberIndex !== undefined && toSave.relationship?.memberIndex !== null && toSave.relationship.memberIndex !== "") {
      const referencedMember = members[toSave.relationship.memberIndex];
      if (referencedMember) {
        toSave.relationship.memberName = referencedMember.firstName;
      }
    }
    if (editingIndex >= 0) {
      const updated = [...members];
      updated[editingIndex] = toSave;
      setMembers(updated);
    } else {
      setMembers((prev) => [...prev, toSave]);
    }
    // reset for next entry
    setCurrentMember({ headOfFamily: false, relationship: {} });
    setEditingIndex(-1);
    // hide form after every save, user must click "Add More Members" to add again
    setShowMemberForm(false);
  };

  const startAddMore = () => {
    setCurrentMember({ headOfFamily: false, relationship: {} });
    setEditingIndex(-1);
    setMemberError("");
    setShowMemberForm(true);
  };

  const handleEditMember = (idx) => {
    const memberToEdit = members[idx];
    const relationship = memberToEdit.relationship || {};
    const memberIndex =
      relationship.memberIndex !== undefined &&
      relationship.memberIndex !== null
        ? relationship.memberIndex
        : relationship.memberName
        ? members.findIndex((m) => m.firstName === relationship.memberName)
        : "";

    setEditingIndex(idx);
    setCurrentMember({
      ...memberToEdit,
      relationship: {
        ...relationship,
        memberIndex: memberIndex >= 0 ? memberIndex : "",
      },
    });
    setMemberError("");
    setShowMemberForm(false);
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setCurrentMember({ headOfFamily: false, relationship: {} });
    setMemberError("");
    setShowMemberForm(false);
  };

  const handleDeleteMember = (idx) => {
    const updated = members.filter((_, i) => i !== idx);
    setMembers(updated);
    // if we deleted head, make sure next add sets headOfFamily true if no members
    if (updated.length === 0) {
      setCurrentMember({ headOfFamily: true });
      setShowMemberForm(true);
    }
  };

  const handleSubmitApplication = async () => {
    setSubmitError("");
    setSubmitSuccess("");
    try {
      // ensure address lines are always sent (JSON.stringify omits undefined values)
      const address = familyForm.familyAddress || {};
      const payload = {
        familyDetails: {
          ...familyForm,
          familyAddress: {
            addressLine1: address.addressLine1 || "",
            addressLine2: address.addressLine2 || "",
            addressLine3: address.addressLine3 || "",
            district: address.district || "",
            city: address.city || "",
            state: address.state || "",
            postalCode: address.postalCode || "",
            country: address.country || "",
          },
        },
        members: members.map((member) => {
          const updated = { ...member };
          if (updated.relationship) {
            const memberIndex = updated.relationship.memberIndex;
            if (memberIndex !== undefined && memberIndex !== null && memberIndex !== "") {
              const referencedMember = members[memberIndex];
              updated.relationship.memberName = referencedMember?.firstName || updated.relationship.memberName || "";
            }
            delete updated.relationship.memberIndex;
          }
          return updated;
        }),
      };
      console.log("submitting payload", payload);
      const response = await api.post("/family/familyRegistrationRequest", payload);
      // Server should return surname and familyRegistrationId on success.
      if (response.data) {
        const surname = response.data.surname || familyForm.surname;
        const familyRegistrationId =
          response.data.familyRegistrationId;
        if (surname && familyRegistrationId) {
          setSubmissionDetails({ surname, familyRegistrationId });
        } else if (response.data.operationMessage) {
          setSubmitSuccess(response.data.operationMessage);
        } else {
          setSubmitSuccess("Application submitted successfully.");
        }
      } else {
        setSubmitSuccess("Application submitted successfully.");
      }
    } catch (err) {
      if (err.response?.data?.operationMessage) {
        setSubmitError(err.response.data.operationMessage);
      } else {
        setSubmitError(ERROR_MESSAGES.DEFAULT);
      }
    }
  };

    // render helpers
    const renderFamilyForm = () => (
        <div className="card-body d-flex flex-wrap align-items-start p-0" style={{ gap: "1rem" }}>
            <div className="card mb-5 p-4 bg-body-secondary border-0">
                <div className="row">
                    <h6 className="fw-bold">Enter Family Details</h6>
                </div>
                <form onSubmit={handleFamilyNext}>
                    <div className="row">
                        <div className="col-sm-4">
                            <span className="fw-semibold me-2">
                                Surname (E.g. Alekar, Dulare etc.): <span className="text-danger">*</span>
                            </span>
                            <input
                                name="surname"
                                value={familyForm.surname || ""}
                                onChange={handleFamilyChange}
                                className="form-control d-inline w-auto"
                                placeholder="Surname e.g. Alekar, Dulare etc."
                            />
                        </div>
                        <div className="col-sm-4">
                            <span className="fw-semibold me-2">Surname (Hindi):</span>
                            <input
                                name="surnameInHindi"
                                value={familyForm.surnameInHindi || ""}
                                onChange={handleFamilyChange}
                                className="form-control d-inline w-auto"
                                placeholder="Surname (Hindi)"
                            />
                        </div>
                        <div className="col-sm-4">
                            <span className="fw-semibold me-2">
                                Gotra:
                            </span>
                            <input
                                name="gotra"
                                value={familyForm.gotra || ""}
                                onChange={handleFamilyChange}
                                className="form-control d-inline w-auto"
                                placeholder="Gotra"
                            />
                        </div>
                        <div className="col-sm-4">
                            <span className="fw-semibold me-2">Email:</span>
                            <input
                                name="email"
                                value={familyForm.email || ""}
                                onChange={handleFamilyChange}
                                className="form-control d-inline w-auto"
                                placeholder="Email"
                            />
                        </div>
                        <div className="col-sm-4">
                            <span className="fw-semibold me-2">Phone:</span>
                            <input
                                name="phone"
                                value={familyForm.phone || ""}
                                onChange={handleFamilyChange}
                                className="form-control d-inline w-auto"
                                placeholder="Phone"
                            />
                        </div>
                    </div>
                    <div className="d-flex">
                        <span className="fw-semibold me-2">Address:</span>
                        <div className="row">
                            <div className="col-sm-4">
                                <span className="fw-semibold me-2">
                                    Address Line 1: <span className="text-danger">*</span>
                                </span>
                                <input
                                    name="familyAddress.addressLine1"
                                    value={familyForm.familyAddress?.addressLine1 || ""}
                                    onChange={handleFamilyChange}
                                    className="form-control mb-1"
                                    placeholder="Address Line 1"
                                />
                            </div>
                            <div className="col-sm-4">
                                <span className="fw-semibold me-2">Address Line 2:</span>
                                <input
                                    name="familyAddress.addressLine2"
                                    value={familyForm.familyAddress?.addressLine2 || ""}
                                    onChange={handleFamilyChange}
                                    className="form-control mb-1"
                                    placeholder="Address Line 2"
                                />
                            </div>
                            <div className="col-sm-4">
                                <span className="fw-semibold me-2">Address Line 3:</span>
                                <input
                                    name="familyAddress.addressLine3"
                                    value={familyForm.familyAddress?.addressLine3 || ""}
                                    onChange={handleFamilyChange}
                                    className="form-control mb-1"
                                    placeholder="Address Line 3"
                                />
                            </div>
                            <div className="col-sm-4">
                                <span className="fw-semibold me-2">District:</span>
                                <input
                                    name="familyAddress.district"
                                    value={familyForm.familyAddress?.district || ""}
                                    onChange={handleFamilyChange}
                                    className="form-control mb-1"
                                    placeholder="District"
                                />
                            </div>
                            <div className="col-sm-4">
                                <span className="fw-semibold me-2">
                                    City: <span className="text-danger">*</span>
                                </span>
                                <input
                                    name="familyAddress.city"
                                    value={familyForm.familyAddress?.city || ""}
                                    onChange={handleFamilyChange}
                                    className="form-control mb-1"
                                    placeholder="City"
                                />
                            </div>
                            <div className="col-sm-4">
                                <span className="fw-semibold me-2">
                                    State: <span className="text-danger">*</span>
                                </span>
                                <AutoSuggest
                                    name="familyAddress.state"
                                    value={familyForm.familyAddress?.state || ""}
                                    onChange={handleFamilyChange}
                                    suggestions={indiaStates}
                                    className="form-control mb-1"
                                    placeholder="State"
                                    ariaLabel="State"
                                />
                            </div>
                            <div className="col-sm-4">
                                <span className="fw-semibold me-2">
                                    Postal Code: <span className="text-danger">*</span>
                                </span>
                                <input
                                    name="familyAddress.postalCode"
                                    value={familyForm.familyAddress?.postalCode || ""}
                                    onChange={handleFamilyChange}
                                    className="form-control mb-1"
                                    placeholder="Postal Code"
                                />
                            </div>
                            <div className="col-sm-4">
                                <span className="fw-semibold me-2">
                                    Country: <span className="text-danger">*</span>
                                </span>
                                <AutoSuggest
                                    name="familyAddress.country"
                                    value={familyForm.familyAddress?.country || ""}
                                    onChange={handleFamilyChange}
                                    suggestions={countryOptions}
                                    className="form-control mb-1"
                                    placeholder="Country"
                                    ariaLabel="Country"
                                />
                            </div>
                        </div>
                    </div>
                    {familyError && (
                        <div className="alert alert-danger py-1 my-2">{familyError}</div>
                    )}
                    <div className="mt-3 text-end">
                        <button className="btn btn-primary fw-bold" type="submit">
                            Next
                        </button>
                    </div>
                </form>
            </div>
            </div>
    );

  const renderFamilySummary = () => (
    <div className="card mb-4 p-3 bg-light">
      <h6 className="fw-semibold">Family Details: </h6>
      <div>
        Surname: {familyForm.surname}
        {familyForm.surnameInHindi && 
          ` (${familyForm.surnameInHindi})`}{" "}
      </div>
      
      {familyForm.gotra && <div>Gotra: {familyForm.gotra}</div>}
      {familyForm.email && <div>Email: {familyForm.email}</div>}
      {familyForm.phone && <div>Phone: {familyForm.phone}</div>}
      <div>
        Address: {familyForm.familyAddress?.addressLine1}
        {familyForm.familyAddress?.addressLine2 && `, ${familyForm.familyAddress.addressLine2}`}
        {familyForm.familyAddress?.addressLine3 && `, ${familyForm.familyAddress.addressLine3}`}
        {familyForm.familyAddress?.district && `, ${familyForm.familyAddress.district}`}
        , {familyForm.familyAddress?.city}, {familyForm.familyAddress?.state}, {familyForm.familyAddress?.postalCode}, {familyForm.familyAddress?.country}
      </div>
    </div>
  );

  const renderMemberForm = ({ inline = false } = {}) => {
    const isEditing = editingIndex >= 0;
    // determine heading
    let heading = "";
    if (isEditing) heading = "Edit Member";
    else if (members.length === 0) heading = "Add Head of Family";
    else heading = "Add Family Member";

    const relatedMemberOptions = members
      .map((member, idx) => ({ member, idx }))
      .filter((item) => item.idx !== editingIndex);

    return (
      <div
        className={
          inline
            ? "card mb-3 p-3 bg-body-secondary border-0"
            : "card-body d-flex flex-wrap align-items-start p-0"
        }
        style={inline ? {} : { gap: "1rem" }}
      >
        <form onSubmit={handleMemberSave}>
          <div className="row mb-2">
            <h6 className="fw-bold">{heading}</h6>
          </div>
          {currentMember.headOfFamily && (
            <input type="hidden" name="headOfFamily" value="true" />
          )}
          <div className="row">
            <div className="col-sm-4">
              <span className="fw-semibold me-2">
                First Name (English): <span className="text-danger">*</span>
              </span>
              <input
                name="firstName"
                value={currentMember.firstName || ""}
                onChange={handleMemberChange}
                className="form-control d-inline w-auto"
                placeholder="First Name"
                required
              />
            </div>
            <div className="col-sm-4">
              <span className="fw-semibold me-2">
                First Name (Hindi):
              </span>
              <input
                name="firstNameInHindi"
                value={currentMember.firstNameInHindi || ""}
                onChange={handleMemberChange}
                className="form-control d-inline w-auto"
                placeholder="First Name in Hindi"
              />
            </div>
            <div className="col-sm-4">
              <span className="fw-semibold me-2">Phone:</span>
              <input
                name="phoneNumber"
                value={currentMember.phoneNumber || ""}
                onChange={handleMemberChange}
                className="form-control d-inline w-auto"
                placeholder="Phone Number"
              />
            </div>
            <div className="col-sm-4">
              <span className="fw-semibold me-2">
                Gender: <span className="text-danger">*</span>
              </span>
              <select
                name="gender"
                value={currentMember.gender || ""}
                onChange={handleMemberChange}
                className="form-select"
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
                value={currentMember.maritalStatus || ""}
                onChange={handleMemberChange}
                className="form-select"
              >
                {maritalStatusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-sm-4">
              <span className="fw-semibold me-2">Wedding Date:</span>
              <input
                name="weddingDate"
                type="date"
                value={currentMember.weddingDate || ""}
                onChange={handleMemberChange}
                className="form-control d-inline w-auto"
              />
            </div>
            <div className="col-sm-4">
              <span className="fw-semibold me-2">Birth Day:</span>
              <select
                name="birthDay"
                value={currentMember.birthDay || ""}
                onChange={handleMemberChange}
                className="form-select"
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
                value={currentMember.birthMonth || ""}
                onChange={handleMemberChange}
                className="form-select"
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
                value={currentMember.birthYear || ""}
                onChange={handleMemberChange}
                className="form-control d-inline w-auto"
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-sm-4">
              <span className="fw-semibold me-2">Email:</span>
              <input
                name="email"
                type="email"
                value={currentMember.email || ""}
                onChange={handleMemberChange}
                className="form-control d-inline w-auto"
              />
            </div>
            <div className="col-sm-4">
              <span className="fw-semibold me-2">Education Details:</span>
              <input
                name="educationDetails"
                value={currentMember.educationDetails || ""}
                onChange={handleMemberChange}
                className="form-control d-inline w-auto"
              />
            </div>
            <div className="col-sm-4">
              <span className="fw-semibold me-2">Occupation:</span>
              <input
                name="occupation"
                value={currentMember.occupation || ""}
                onChange={handleMemberChange}
                className="form-control d-inline w-auto"
              />
            </div>
          </div>
          {!currentMember.headOfFamily && (
            <div className="row mt-2">
              <div className="col-sm-4">
                <span className="fw-semibold me-2">
                  Related Member: <span className="text-danger">*</span>
                </span>
                <select
                  name="relationship.memberIndex"
                  value={currentMember.relationship?.memberIndex ?? ""}
                  onChange={handleMemberChange}
                  className="form-select"
                >
                  <option value="">Select Member</option>
                  {relatedMemberOptions.map(({ member, idx }) => (
                    <option key={idx} value={idx}>
                      Member {idx + 1}{member.firstName ? ` - ${member.firstName}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-sm-4">
                <span className="fw-semibold me-2">
                  Relationship Type: <span className="text-danger">*</span>
                </span>
                <select
                  name="relationship.relationshipType"
                  value={currentMember.relationship?.relationshipType || ""}
                  onChange={handleMemberChange}
                  className="form-select"
                >
                  <option value="">Select Relationship</option>
                  {(() => {
                    const gender = currentMember.gender;
                    let opts = [];
                    if (gender === "Male") {
                      opts = [
                        { value: "Father", label: "Father" },
                        { value: "Husband", label: "Husband" },
                        { value: "Son", label: "Son" },
                      ];
                    } else if (gender === "Female") {
                      opts = [
                        { value: "Mother", label: "Mother" },
                        { value: "Wife", label: "Wife" },
                        { value: "Daughter", label: "Daughter" },
                      ];
                    }
                    return opts.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ));
                  })()}
                </select>
              </div>
            </div>
          )}
          {memberError && (
            <div className="alert alert-danger py-1 my-2">{memberError}</div>
          )}
          <div className="mt-3 text-end">
            <button className="btn btn-primary fw-bold me-2" type="submit">
              {isEditing ? "Save" : "Add"}
            </button>
            {inline && (
              <button
                type="button"
                className="btn btn-outline-secondary fw-bold"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    );
  };

  const renderSuccessMessage = () => (
    <div className="container p-4 bg-white rounded mt-4">
      <div className="row">
        <h3 className="mb-3 text-center text-success">Registration Request Submitted Successfully</h3>
      </div>
      <div className="card p-4 bg-light">
        <div className="text-center">
          <h6 className="mb-4">Your family registration request has been received with the following details:</h6>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="mb-3">
                <strong>Family Surname:</strong> {submissionDetails.surname}
              </div>
              <div className="mb-3">
                <strong>Registration Request Id:</strong> {submissionDetails.familyRegistrationId}
              </div>
            </div>
          </div>
          <p className="mt-4 text-muted">
            Our admin team will review your request and add your family details to the application within the next couple of days.
          </p>
        </div>
      </div>
    </div>
  );

  const renderMembersList = () => (
    <div className="card mb-4 p-3 bg-white">
      <h6 className="fw-semibold">Family Members</h6>
      {members.map((m, idx) => (
        <div
          key={idx}
          className="border rounded p-2 mb-2 bg-light position-relative"
        >
          {editingIndex === idx ? (
            renderMemberForm({ inline: true })
          ) : (
            <>
              <div>
                <strong>Member {idx + 1}: {m.firstName}</strong>
                {m.firstNameInHindi && <> ({m.firstNameInHindi})</>}
                {m.headOfFamily && <span className="ms-2 badge bg-primary">Head Of Family</span>}
              </div>
              {m.phoneNumber && <div>Phone: {m.phoneNumber}</div>}
              {!m.headOfFamily && m.relationship && (
                <div>
                  Relationship: {m.relationship.relationshipType} to {members[m.relationship.memberIndex]?.firstName || "Unknown"}
                </div>
              )}
              <div>Gender: {m.gender}</div>
              <div>Marital Status: {m.maritalStatus}</div>
              {m.weddingDate && <div>Wedding: {m.weddingDate}</div>}
              <div>
                DOB: {m.birthDay}/{m.birthMonth}/{m.birthYear}
              </div>
              {m.email && <div>Email: {m.email}</div>}
              {m.educationDetails && <div>Education: {m.educationDetails}</div>}
              {m.occupation && <div>Occupation: {m.occupation}</div>}
              <div className="position-absolute" style={{ top: 4, right: 4 }}>
                <button
                  className="btn btn-sm fw-bold btn-primary me-2"
                  onClick={() => handleEditMember(idx)}
                >
                  <i className="bi bi-pencil-square"></i> Edit
                </button>
                {idx === members.length - 1 && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleDeleteMember(idx)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );

  return (
    submissionDetails ? renderSuccessMessage() : (
      <div className="container p-4 bg-white rounded mt-4">
          <div className="row">
          <h3 className="mb-3 float-start">Register Family</h3>
          </div>
          {/* <div className="card-body d-flex flex-wrap align-items-start p-0" style={{ gap: "1rem" }}> */}
            {step === "family" && renderFamilyForm()}
          {step === "members" && (
              <>
                  {renderFamilySummary()}
                  <div className="row">
                    <h6 className="fw-bold">Member Details</h6>
                </div>
                  {/* if we already have members show them and related controls */}
                  {members.length > 0 && (
                      <>
                          {renderMembersList()}
                          <div className="my-2 text-end">
                              <button
                                  type="button"
                                  className="btn btn-outline-primary"
                                  onClick={startAddMore}
                              >
                                  Add More Members
                              </button>
                          </div>
                          <div className="alert alert-info py-1">
                              Once you have finished adding members, click "Submit Application" below to process the request.
                          </div>
                      </>
                  )}
                  {showMemberForm && editingIndex < 0 && renderMemberForm()}
                  {submitError && <FailureBanner message={submitError} />}
                  {submitSuccess && <SuccessBanner message={submitSuccess} />}
                  {members.length > 0 && (
                      <div className="text-end mt-3">
                          <button
                              className="btn btn-success fw-bold"
                              onClick={handleSubmitApplication}
                          >
                              Submit Application
                          </button>
                      </div>
                  )}
              </>
          )}
          </div>
    )
  );
};

export default RegisterFamilyRequest;
