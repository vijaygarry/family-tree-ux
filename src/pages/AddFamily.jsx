import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import ERROR_MESSAGES from "../constants/messages";


const AddFamily = () => {
  const [form, setForm] = useState({});
  const [editError, setEditError] = useState("");
  const [familyId, setFamilyId] = useState("");
  const [familyName, setFamilyName ] = useState("");
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);

  useEffect(() => {
    setForm({});
    setCreatedSuccessfully(false);
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('familyAddress.')) {
      setForm((prev) => ({
        ...prev,
        familyAddress: {
          ...prev.familyAddress,
          [name.replace('familyAddress.', '')]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!form.familyName?.trim()) return "Family Name is required.";
    if (!form.gotra?.trim()) return "Gotra is required.";
    if (!form.familyAddress?.addressLine1?.trim()) return "Address Line 1 is required.";
    if (!form.familyAddress?.city?.trim()) return "City is required.";
    if (!form.familyAddress?.state?.trim()) return "State is required.";
    if (!form.familyAddress?.postalCode?.trim()) return "Postal Code is required.";
    if (!form.familyAddress?.country?.trim()) return "Country is required.";
    return "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setEditError("");
    const validationMsg = validateForm();
    if (validationMsg) {
      setEditError(validationMsg);
      return;
    }
    try {
      const payload = { ...form };
      const response = await api.post('/family/addfamily', payload);
      if (response.data) {
        setFamilyId(response.data.familyId)
        setFamilyName(response.data.familyName)
        setCreatedSuccessfully(true);
      }
    } catch (err) {
      if (err.response?.data?.operationMessage) {
        // API returned an error in payload
        setEditError(err.response?.data?.operationMessage);
      } else {
        setEditError(ERROR_MESSAGES.DEFAULT);
      }
    }
  };

  const familyInformationEditForm = (
    <form onSubmit={handleSave}>
      <div className="row">
      <h5 className="mb-3 float-start">Add Family Details</h5>
      </div>
      {createdSuccessfully && (
        <div className="alert alert-success py-1 my-2">
          Family <strong>{familyName}</strong> added successfully with family id <strong>{familyId}</strong>.
        </div>
      )}
      <div className="card mb-5 p-4 bg-body-secondary border-0"> 
      <div className="row">
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Family Name: <span className="text-danger">*</span></span>
          <input name="familyName" value={form.familyName} onChange={handleFormChange} className="form-control d-inline w-auto" placeholder={createdSuccessfully ? undefined : "Family Name"} disabled={!!createdSuccessfully} />
        </div>
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Family Name (Hindi):</span>
          <input name="familyNameInHindi" value={form.familyNameInHindi} onChange={handleFormChange} className="form-control d-inline w-auto" placeholder={createdSuccessfully ? undefined : "Family Name (Hindi)"} disabled={!!createdSuccessfully} />
        </div>
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Gotra: <span className="text-danger">*</span></span>
          <input name="gotra" value={form.gotra} onChange={handleFormChange} className="form-control d-inline w-auto" placeholder={createdSuccessfully ? undefined : "Gotra"} disabled={!!createdSuccessfully}/>
        </div>
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Email:</span>
          <input name="email" value={form.email} onChange={handleFormChange} className="form-control d-inline w-auto" placeholder={createdSuccessfully ? undefined : "Email"} disabled={!!createdSuccessfully}/>
        </div>
        <div className="col-sm-4">
          <span className="fw-semibold me-2">Phone:</span>
          <input name="phone" value={form.phone} onChange={handleFormChange} className="form-control d-inline w-auto" placeholder={createdSuccessfully ? undefined : "Phone"} disabled={!!createdSuccessfully}/>
        </div>
      </div>
      <div className="d-flex">
        <span className="fw-semibold me-2">Address:</span>
        <div className="row">
          <div className="col-sm-4">
          Address Line 1: <span className="text-danger">*</span><input name="familyAddress.addressLine1" value={form.familyAddress?.addressLine1 || ''} onChange={handleFormChange} className="form-control mb-1" placeholder={createdSuccessfully ? undefined : "Address Line 1"} disabled={!!createdSuccessfully} />
          </div>
          <div className="col-sm-4">
          Address Line 2: <input name="familyAddress.addressLine2" value={form.familyAddress?.addressLine2 || ''} onChange={handleFormChange} className="form-control mb-1" placeholder={createdSuccessfully ? undefined : "Address Line 2"} disabled={!!createdSuccessfully} />
          </div>
          <div className="col-sm-4">
          Address Line 3: <input name="familyAddress.addressLine3" value={form.familyAddress?.addressLine3 || ''} onChange={handleFormChange} className="form-control mb-1" placeholder={createdSuccessfully ? undefined : "Address Line 3"} disabled={!!createdSuccessfully} />
          </div>
          <div className="col-sm-4">
          District: <input name="familyAddress.district" value={form.familyAddress?.district || ''} onChange={handleFormChange} className="form-control mb-1" placeholder={createdSuccessfully ? undefined : "District"} disabled={!!createdSuccessfully} />
          </div>
          <div className="col-sm-4">
          City: <span className="text-danger">*</span><input name="familyAddress.city" value={form.familyAddress?.city || ''} onChange={handleFormChange} className="form-control mb-1" placeholder={createdSuccessfully ? undefined : "City"} disabled={!!createdSuccessfully} />
          </div>
          <div className="col-sm-4">
          State: <span className="text-danger">*</span><input name="familyAddress.state" value={form.familyAddress?.state || ''} onChange={handleFormChange} className="form-control mb-1" placeholder={createdSuccessfully ? undefined : "State"} disabled={!!createdSuccessfully} />
          </div>
          <div className="col-sm-4">
          Postal Code: <span className="text-danger">*</span><input name="familyAddress.postalCode" value={form.familyAddress?.postalCode || ''} onChange={handleFormChange} className="form-control mb-1" placeholder={createdSuccessfully ? undefined : "Postal Code"} disabled={!!createdSuccessfully} />
          </div>
          <div className="col-sm-4">
          Country: <span className="text-danger">*</span><input name="familyAddress.country" value={form.familyAddress?.country || ''} onChange={handleFormChange} className="form-control mb-1" placeholder={createdSuccessfully ? undefined : "Country"} disabled={!!createdSuccessfully} />
          </div>
        </div>
      </div>

      {editError && <div className="alert alert-danger py-1 my-2">{editError}</div>}
      {createdSuccessfully ? (
        
          <div className="mt-3 text-end">
            <button type="button" className="btn btn-primary fw-bold me-4" 
            onClick={() => window.location.href = `/family/${familyId}`}>
              View {familyName} Family
            </button>
            <button type="button" className="btn btn-outline-primary fw-bold me-2" onClick={() => window.location.href = `/addfamily`} >
              Add Another Family
            </button>
          </div>
        
      )
      : (
        <div className="mt-3 text-end">
        <button className="btn btn-primary fw-bold me-2" type="submit">Add Family</button>
        {/* <button className="btn btn-outline-primary btn-sm" onClick={handleCancelEdit}>Cancel</button> */}
      </div>
      )}
      
      </div>
    </form>
  );

  return (
    <div className="container p-4 bg-white rounded mt-4">
      <div
        className="card-body d-flex flex-wrap align-items-start p-0"
        style={{ gap: "1rem" }}
      >
        {familyInformationEditForm}
      </div>
    </div>
  );
};

export default AddFamily;
