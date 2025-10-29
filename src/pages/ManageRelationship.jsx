import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import ERROR_MESSAGES from "../constants/messages";
import { SuccessBanner, FailureBanner } from "../components/AlertBanners";
import { relationshipTypeOptions } from "../constants/DropdownConstants";

const ManageRelationship = () => {
  const [relationshipForm, setRelationshipForm] = useState({});
  const [processError, setProcessError] = useState("");
  const [processSuccess, setProcessSuccess] = useState("");

  useEffect(() => {
    setRelationshipForm({});
    setProcessError("");
    setProcessSuccess("");
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("relationship.")) {
      setRelationshipForm((prev) => ({
        ...prev,
        relationship: {
          ...prev.relationship,
          [name.replace("relationship.", "")]: value,
        },
      }));
    } else {
      setRelationshipForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!relationshipForm.relationship.memberId?.trim())
      return "Member Id is required.";
    if (!relationshipForm.relationship.memberName?.trim())
      return "Member name is required.";
    if (!relationshipForm.relationship.relationshipType?.trim())
      return "Relationship is required.";
    if (!relationshipForm.relationship.relatedMemberId?.trim())
      return "Related Member Id is required.";
    if (!relationshipForm.relationship.relatedMemberName?.trim())
      return "Related Member Name is required.";
    return "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setProcessError("");
    setProcessSuccess("");
    const validationMsg = validateForm();
    if (validationMsg) {
      setProcessError(validationMsg);
      return;
    }

    try {
      const response = await api.post("/family/manageRelationship", {
        ...relationshipForm,
      });
      setRelationshipForm({});
      if (response?.data?.operationMessage) {
        setProcessSuccess(response?.data?.operationMessage);
      } else {
        setProcessSuccess("Member relationship updated successfully.");
      }
    } catch (err) {
      if (err.response?.data?.operationMessage) {
        // API returned an error in payload
        setProcessError(err.response?.data?.operationMessage);
      } else {
        setProcessError(ERROR_MESSAGES.DEFAULT);
      }
    }
  };

  const getRelationshipString = (relType, memberName, relatedMemberName) => {
    if (!relType) return `Add relationship to ${memberName}`;
    return `Link ${relatedMemberName} as ${memberName}'s ${relType.toLowerCase()}`;
  };

  const showRelationshipForm = (
    <form onSubmit={handleSave}>
      {/* Member Profile Section */}
      <div className="row">
        <h5 className="mb-3 float-start">
          {getRelationshipString(
            relationshipForm.relationship?.relationshipType || "",
            relationshipForm.relationship?.memberName || "Member",
            relationshipForm.relationship?.relatedMemberName ||
              "Related Member",
          )}
        </h5>
      </div>
      {processError && <FailureBanner message={processError} />}
      <div className="card mb-5 p-4 bg-body-secondary border-0">
        <div className="row">
          <div className="col-sm-4">
            <span className="fw-semibold me-2">
              Member Id: <span className="text-danger">*</span>
            </span>
            <input
              name="relationship.memberId"
              value={relationshipForm.relationship?.memberId || ""}
              onChange={handleFormChange}
              className="form-control d-inline w-auto"
              placeholder="Member Id"
              required
            />
          </div>
          <div className="col-sm-4">
            <span className="fw-semibold me-2">Member Name </span>
            <input
              name="relationship.memberName"
              value={relationshipForm.relationship?.memberName || ""}
              onChange={handleFormChange}
              className="form-control d-inline w-auto"
              placeholder="Member First Name"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <span className="fw-semibold me-2">Relationship Type: </span>
            <select
              name="relationship.relationshipType"
              value={relationshipForm.relationship?.relationshipType || ""}
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
        <div className="row">
          <div className="col-sm-4">
            <span className="fw-semibold me-2">
              Related Member Id: <span className="text-danger">*</span>
            </span>
            <input
              name="relationship.relatedMemberId"
              value={relationshipForm.relationship?.relatedMemberId || ""}
              onChange={handleFormChange}
              className="form-control d-inline w-auto"
              placeholder="Related Member Id"
              required
            />
          </div>
          <div className="col-sm-4">
            <span className="fw-semibold me-2">Related Member Name </span>
            <input
              name="relationship.relatedMemberName"
              value={relationshipForm.relationship?.relatedMemberName || ""}
              onChange={handleFormChange}
              className="form-control d-inline w-auto"
              placeholder="Related Member First Name"
            />
          </div>
        </div>
        <div className="mt-3 text-end">
          <span className="text-danger">
            {" "}
            {getRelationshipString(
              relationshipForm.relationship?.relationshipType || "",
              relationshipForm.relationship?.memberName || "Member",
              relationshipForm.relationship?.relatedMemberName ||
                "Related Member",
            )}{" "}
            =>{" "}
          </span>
          &nbsp;&nbsp;
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
      <SuccessBanner message={processSuccess} />
    </div>
  );

  return (
    <div className="container p-4 bg-white rounded mt-4">
      <div
        className="card-body d-flex flex-wrap align-items-start p-0"
        style={{ gap: "1rem" }}
      >
        {processSuccess ? showSuccessMsg : showRelationshipForm}
      </div>
    </div>
  );
};

export default ManageRelationship;
