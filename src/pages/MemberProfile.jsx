import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { getFormattedPhoneDisplay } from "../utils/phoneUtils";
import { formatISODateToddMMMyyyy } from "../utils/formatUtils";
import "./TreeNode.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ERROR_MESSAGES from "../constants/messages";
import { RelationshipTable, SpouseTable } from "../components/MemberListTable";
import { genderOptions, maritalStatusOptions, monthOptions, dayOptions } from "../constants/DropdownConstants";
import ImageUploadCropModal from "../components/ImageUploadCropModal";
import { SuccessBanner, FailureBanner } from "../components/AlertBanners";


const MemberProfile = () => {
  const { id } = useParams(); // from route: /member/:id
  const [memberData, setMemberData] = useState(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [showImageEdit, setShowImageEdit] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const requestBody = id ? { memberId: parseInt(id) } : {};
        const res = await api.post("/family/getmemberprofile", requestBody);
        setMemberData(res.data);
        setForm({
          ...res.data?.memberProfile,
          memberAddress: {...res.data?.memberProfile?.memberAddress} || {},
        });
        setError("");
        // Scroll to top whenever profile changes
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Failed to fetch member data", err);
        if (err.response?.data?.operationMessage) {
          // API returned an error in payload
          setError(err.response?.data?.operationMessage);
        } else {
          setError(ERROR_MESSAGES.DEFAULT);
        }
      }
    };
    fetchMember();
  }, [id]);

  const handleEditClick = () => setEditMode(true);

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditError("");
    setEditSuccess("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('memberAddress.')) {
      setForm((prev) => ({
        ...prev,
        memberAddress: {
          ...prev.memberAddress,
          [name.replace('memberAddress.', '')]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!form.firstName?.trim()) return "First Name is required.";
    if (!form.gender?.trim()) return "Gender is required.";
    if (!form.maritalStatus?.trim()) return "Marital Status is required.";
    if (!form.birthMonth?.trim()) return "Birth month is required.";
    if (!form.birthYear) return "Birth year is required.";
    if (!form.addressSameAsFamily) {
      if (!form.memberAddress?.addressLine1?.trim()) return "Address Line 1 is required.";
      if (!form.memberAddress?.city?.trim()) return "City is required.";
      if (!form.memberAddress?.state?.trim()) return "State is required.";
      if (!form.memberAddress?.postalCode?.trim()) return "Postal Code is required.";
      if (!form.memberAddress?.country?.trim()) return "Country is required.";
    }
    return "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");
    const validationMsg = validateForm();
    if (validationMsg) {
      setEditError(validationMsg);
      return;
    }

    try {
      const response = await api.post("/family/updateMemberProfile", { ...form, memberId: memberProfile.memberId });
      
      setMemberData((prev) => ({ ...prev, memberProfile: { ...form } }));
      if (response?.data?.operationMessage) {
        setEditSuccess(response?.data?.operationMessage);
      } else {
        setEditSuccess("Member profile updated successfully.");
      }
      setEditMode(false);
    } catch (err) {
      if (err.response?.data?.operationMessage) {
        // API returned an error in payload
        setEditError(err.response?.data?.operationMessage);
      } else {
        setEditError(ERROR_MESSAGES.DEFAULT);
      }
    }
  };

  const handleImageSave = async (croppedImageBlob) => {
    setEditError("");
    setEditSuccess("");
    try {
      const formData = new FormData();
      formData.append("memberId", memberProfile.memberId);
      formData.append("image", croppedImageBlob, "member-image.jpg");
      const response = await api.post(
        "/family/updateMemberImage",
        formData, {
          headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.uploadedImagePath) {
        setMemberData((prev) => ({
          ...prev,
          memberProfile: {
            ...prev.memberProfile,
            profileImage: response.data.uploadedImagePath,
          },
        }));
        setEditSuccess("Member image updated successfully.");
        setShowImageEdit(false);
      } else {
        setEditError("Image upload failed. Please try again.");
      }
    } catch (err) {
      if (err.response?.data?.operationMessage) {
        // API returned an error in payload
        setError(err.response?.data?.operationMessage);
      } else {
        setError(ERROR_MESSAGES.DEFAULT);
      }
    }
  };

  if (error) return <div className="text-danger p-4">{error}</div>;
  if (!memberData) return <div className="p-4">Loading member profile...</div>;
  const { memberProfile } = memberData;



  const memberInformationEditForm = (
    <form onSubmit={handleSave}>
      {/* Member Profile Section */}
      <div className="row">
      <h5 className="mb-3 float-start">Edit {memberProfile.firstName} {memberProfile.lastName}'s Profile</h5>
      </div>
      {editError && <FailureBanner message={editError} />}
      <div className="card mb-5 p-4 bg-body-secondary border-0"> 
      <div className="row">
        <div className="col-sm-4">
          <span className="fw-semibold me-2">First Name: <span className="text-danger">*</span></span>
          <input name="firstName" value={form.firstName || ''} onChange={handleFormChange} className="form-control d-inline w-auto" placeholder="First Name" required />
        </div>
        <div className="col-sm-4">
          <span className="fw-semibold me-2">First Name (Hindi): </span>
          <input name="firstNameInHindi" value={form.firstNameInHindi || ''} onChange={handleFormChange} className="form-control d-inline w-auto" placeholder="First Name in Hindi" />
        </div>
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Maiden Last Name: </span>
          <input name="maidenLastName" value={form.maidenLastName || ''} onChange={handleFormChange} className="form-control d-inline w-auto" placeholder="Maiden Last Name" />
        </div>
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Nick Name: </span>
          <input name="nickName" value={form.nickName || ''} onChange={handleFormChange} className="form-control d-inline w-auto" placeholder="Nick Name" />
        </div>
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Nick Name (Hindi): </span>
          <input name="nickNameInHindi" value={form.nickNameInHindi || ''} onChange={handleFormChange} className="form-control d-inline w-auto" placeholder="Nick Name in Hindi" />
        </div>
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Phone: </span>
          <input name="phone" value={form.phone || ''} onChange={handleFormChange} className="form-control d-inline w-auto" placeholder="Phone" />
        </div>
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Gender: <span className="text-danger">*</span></span>
          <select name="gender" value={form.gender || ''} onChange={handleFormChange} className="form-select" required placeholder="Gender">
            {genderOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Marital Status: <span className="text-danger">*</span></span>
          <select name="maritalStatus" value={form.maritalStatus || ''} onChange={handleFormChange} className="form-select" required placeholder="Marital Status">
            {maritalStatusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Wedding Date: </span>
          <input name="weddingDate" type="date" value={form.weddingDate || ''} onChange={handleFormChange} className="form-control d-inline w-auto" placeholder="Wedding Date" />
        </div>
      
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Birth Day: </span>
          <select name="birthDay" value={form.birthDay || ''} onChange={handleFormChange} className="form-select" placeholder="Birth Day">
            {dayOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Birth Month: <span className="text-danger">*</span></span>
          <select name="birthMonth" value={form.birthMonth || ''} onChange={handleFormChange} className="form-select" required placeholder="Birth Month">
            {monthOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Birth Year: <span className="text-danger">*</span></span>
          <input name="birthYear" type="number" min="1900" max={new Date().getFullYear()} value={form.birthYear || ''} onChange={handleFormChange} className="form-control d-inline w-auto" required placeholder="Birth Year" />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Email: </span>
          <input name="email" type="email" value={form.email || ''} onChange={handleFormChange} className="form-control d-inline w-auto" disabled={!!memberProfile.email} placeholder="Email" />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Education Details: </span>
          <input name="educationDetails" value={form.educationDetails || ''} onChange={handleFormChange} className="form-control d-inline w-auto" placeholder="Education Details" />
        </div>
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Occupation: </span>
          <input name="occupation" value={form.occupation || ''} onChange={handleFormChange} className="form-control d-inline w-auto" placeholder="Occupation" />
        </div>
      </div>

      <div className="d-flex">
        <span className="fw-semibold me-2">Member Address:</span>
        <div className="row">
          <div className="col-sm-4">
            <input type="checkbox" id="addressSameAsFamily"
              checked={form.addressSameAsFamily || false}
              onChange={e => setForm(prev => ({ ...prev, addressSameAsFamily: e.target.checked }))}
              className="mb-1" placeholder="Same as family address"
            />
            <label className="fw-semibold ms-2">Member's address is same as family address</label>
          </div>
        </div>
        {!form.addressSameAsFamily && (
          <div className="d-flex">
            <div className="row">
              <div className="col-sm-4">
                <span className="fw-semibold me-2">Address Line 1: <span className="text-danger">*</span></span>
                <input name="memberAddress.addressLine1" value={form.memberAddress?.addressLine1 || ''} onChange={handleFormChange} className="form-control mb-1" placeholder="Address Line 1" />
              </div>
              <div className="col-sm-4">
                <span className="fw-semibold me-2">Address Line 2: </span>
                <input name="memberAddress.addressLine2" value={form.memberAddress?.addressLine2 || ''} onChange={handleFormChange} className="form-control mb-1" placeholder="Address Line 2" />
              </div>
              <div className="col-sm-4">
                <span className="fw-semibold me-2">Address Line 3: </span>
                <input name="memberAddress.addressLine3" value={form.memberAddress?.addressLine3 || ''} onChange={handleFormChange} className="form-control mb-1" placeholder="Address Line 3" />
              </div>
              <div className="col-sm-4">
                <span className="fw-semibold me-2">District: </span>
                <input name="memberAddress.district" value={form.memberAddress?.district || ''} onChange={handleFormChange} className="form-control mb-1" placeholder="District" />
              </div>
              <div className="col-sm-4">
                <span className="fw-semibold me-2">City: <span className="text-danger">*</span></span>
                <input name="memberAddress.city" value={form.memberAddress?.city || ''} onChange={handleFormChange} className="form-control mb-1" placeholder="City" />
              </div>
              <div className="col-sm-4">
                <span className="fw-semibold me-2">State: <span className="text-danger">*</span></span>
                <input name="memberAddress.state" value={form.memberAddress?.state || ''} onChange={handleFormChange} className="form-control mb-1" placeholder="State" />
              </div>
              <div className="col-sm-4">
                <span className="fw-semibold me-2">Postal Code: <span className="text-danger">*</span></span>
                <input name="memberAddress.postalCode" value={form.memberAddress?.postalCode || ''} onChange={handleFormChange} className="form-control mb-1" placeholder="Postal Code" />
              </div>
              <div className="col-sm-4">
                <span className="fw-semibold me-2">Country: <span className="text-danger">*</span></span>
                <input name="memberAddress.country" value={form.memberAddress?.country || ''} onChange={handleFormChange} className="form-control mb-1" placeholder="Country" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 text-end">
        <button className="btn btn-primary fw-bold me-2" type="submit">Save</button>
        <button className="btn btn-outline-primary btn-sm" type="button" onClick={handleCancelEdit}>Cancel</button>
      </div>
      </div>
    </form>
  );

  const memberReadOnlyView = (
    <div className="container p-4 bg-white rounded mt-4">
      {/* Member Profile Section */}
      <h5 className="mb-3 float-start">{memberProfile.firstName} {memberProfile.firstNameInHindi && ` (${memberProfile.firstNameInHindi}) `} {memberProfile.lastName} Profile</h5>
      {memberProfile.canUpdateMember && (
        <button
          className="btn btn-primary fw-bold float-end"
          onClick={handleEditClick}
          title="Edit Member Details"
        >
          <i className="bi bi-pencil-square"></i> Edit Profile
        </button>
      )}
      <div className="clearfix"></div>
      {editSuccess && <SuccessBanner message={editSuccess} />}
      <div className="card mb-5 p-4 bg-body-secondary border-0">
        <div className="row">
          <div className="col-sm-4">
            {/* Member Image (Right) */}
            {memberProfile.profileImage && (
              <div className="text-end" style={{ flex: "0 0 auto" }}>
                <img
                  src={`/${memberProfile.profileImage}`}
                  alt={memberProfile.firstName}
                  style={{ width: "100%", height: "360px", objectFit: "cover", borderRadius: "8px" }}
                />
                {memberProfile.canUpdateMember && (
                  <button
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={() => setShowImageEdit(true)}
                    style={{}}
                  >
                    <i className="bi bi-pencil-square"></i> Edit Image
                  </button>
                )}
              </div>
            )}
            {showImageEdit && (
              <ImageUploadCropModal
                onClose={() => setShowImageEdit(false)}
                onSave={handleImageSave}
                modalHeading={`Update ${memberProfile.firstName}'s Profile Image`}
                imageWidth={600}
                imageHeight={600}
              />
            )}
          </div>
          <div className="col-sm-4">
            <div className="mb-2">
              <span className="fw-bold me-2">Member Name:</span>
              <span className="text-secondary">{memberProfile.firstName} {memberProfile.firstNameInHindi && ` (${memberProfile.firstNameInHindi}) `} {memberProfile.lastName}</span>
          </div>
            {memberProfile.maidenLastName && (
              <div className="mb-2">
                <span className="fw-semibold me-2">Maiden Last Name :</span>
                <span className="text-secondary">{memberProfile.maidenLastName}</span>
              </div>
            )}
            {memberProfile.nickName && (
              <div className="mb-2">
                <span className="fw-semibold me-2">Nick Name :</span>
                <span className="text-secondary">{memberProfile.nickName} {memberProfile.nickNameInHindi && ` (${memberProfile.nickNameInHindi}) `}</span>
              </div>
            )}
            <div className="mb-2">
              <span className="fw-semibold me-2">Gender :</span>
              <span className="text-secondary">{memberProfile.gender}</span>
            </div>
            <div className="mb-2">
              <span className="fw-semibold me-2">Marital Status :</span>
              <span className="text-secondary">{memberProfile.maritalStatus} {memberProfile.weddingDate && ` since ${formatISODateToddMMMyyyy(memberProfile.weddingDate)}`}</span>
            </div>
            <div className="mb-2">
              <span className="fw-semibold me-2">Birth Date :</span>
              <span className="text-secondary"> 🎂 {memberProfile.birthDay} {memberProfile.birthMonth} {memberProfile.birthYear}</span>
            </div>
            {memberProfile.phone && (
              <div className="mb-2">
                <span className="fw-semibold me-2">Phone :</span>
                <span className="text-secondary">{getFormattedPhoneDisplay(
                  memberProfile.phone,
                  memberProfile.phoneWhatsappRegistered,
                )}</span>
              </div>
            )}
            {memberProfile.email && (
              <div className="mb-2">
                <span className="fw-semibold me-2">Email Id :</span>
                <span className="text-secondary">✉️ {memberProfile.email}</span>
              </div>
            )}
            {memberProfile.educationDetails && (
              <div className="mb-2">
                <span className="fw-semibold me-2">Education details :</span>
                <span className="text-secondary"> {memberProfile.educationDetails}</span>
              </div>
            )}
            {memberProfile.occupation && (
              <div className="mb-2">
                <span className="fw-semibold me-2">Occupation :</span>
                <span className="text-secondary"> {memberProfile.occupation}</span>
              </div>
            )}
          </div>
          <div className="col-sm-4">
            <div className="d-flex  mt-5">
              <span className="fw-semibold me-2">Member Address:</span>
              {memberProfile.addressSameAsFamily ? (
                <span>Member address is the same as family address </span>
              ) : (
              <address className="mb-0">
                {memberProfile.memberAddress?.addressLine1}
                <br />
                {memberProfile.memberAddress?.addressLine2 && (
                  <>
                    {memberProfile.memberAddress.addressLine2}
                    <br />
                  </>
                )}
                {memberProfile.memberAddress?.addressLine3 && (
                  <>
                    {memberProfile.memberAddress.addressLine3}
                    <br />
                  </>
                )}
                {memberProfile.memberAddress?.district && (
                  <>
                    {" "}
                    District: {memberProfile.memberAddress.district}
                    <br />
                  </>
                )}
                {memberProfile.memberAddress?.city}, {memberProfile.memberAddress?.state} -{" "}
                {memberProfile.memberAddress?.postalCode.trim()}
                <br />
                {memberProfile.memberAddress?.country}
              </address>
              )}
            </div>
            
            {/* TODO: Currently backend system does not return family addrress, so member is used as filler*/}
            {memberProfile.familyAddress && (
              <div className="d-flex  mt-5">
                <span className="fw-semibold me-2">Family Address:</span>
                <address className="mb-0">
                  {memberProfile.familyAddress?.addressLine1}
                  <br />
                  {memberProfile.familyAddress?.addressLine2 && (
                    <>
                      {memberProfile.familyAddress.addressLine2}
                      <br />
                    </>
                  )}
                  {memberProfile.familyAddress?.addressLine3 && (
                    <>
                      {memberProfile.familyAddress.addressLine3}
                      <br />
                    </>
                  )}
                  {memberProfile.familyAddress?.district && (
                    <>
                      {" "}
                      District: {memberProfile.familyAddress.district}
                      <br />
                    </>
                  )}
                  {memberProfile.familyAddress?.city}, {memberProfile.familyAddress?.state} -{" "}
                  {memberProfile.familyAddress?.postalCode.trim()}
                  <br />
                  {memberProfile.familyAddress?.country}
                </address>
              </div>
            )} { /*End of Member Family Address */}

          </div>
          <div className="mt-auto d-flex align-items-end" style={{ minHeight: '60px' }}>
            <div className="text-end w-100">
              <button
                className="btn btn-primary me-2"
                onClick={() => window.location.href = `/family/${memberProfile.familyId}`}
                disabled={!memberProfile.familyId}
              >
                View {memberProfile.firstName}'s Family
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container p-4 bg-white rounded mt-4">
      <div
        className="card-body d-flex flex-wrap align-items-start p-0"
        style={{ gap: "1rem" }}
      >
      {editMode ? memberInformationEditForm : memberReadOnlyView}
      </div>
      <RelationshipTable membersList={memberData?.parents} relationshipHeading="Parents" />
      <SpouseTable spouse={memberData?.spouse} />
      <RelationshipTable membersList={memberData?.children} relationshipHeading="Children" />
      <RelationshipTable membersList={memberData?.siblings} relationshipHeading="Siblings" />
    </div>
  );
};

export default MemberProfile;
