import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import api from "../api/axiosInstance";
import ERROR_MESSAGES from "../constants/messages";

const STATUSES = ["PENDING", "DUPLICATE", "INVALID", "PROCESSED"];

const statusBadgeClass = (s) => {
  if (s === "PENDING") return "bg-warning text-dark";
  if (s === "PROCESSED") return "bg-success";
  if (s === "DUPLICATE") return "bg-info text-dark";
  if (s === "INVALID") return "bg-danger";
  return "bg-secondary";
};

const FamilyRegistrationManagement = () => {
  const [status, setStatus] = useState("PENDING");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [memberList, setMemberList] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const handleSearch = async (e) => {
    e?.preventDefault();
    setError("");
    try {
      const payload = status ? { status } : {};
      const res = await api.post("/family/getFamilyRegistrationList", payload);
      setHasSearched(true);
      setResults(res.data);
    } catch (err) {
      setHasSearched(true);
      setResults(null);
      if (err.response?.data?.operationMessage) {
        setError(err.response.data.operationMessage);
      } else {
        setError(ERROR_MESSAGES.DEFAULT);
      }
    }
  };

  const handleRowClick = async (familyRequestId) => {
    setRegistrationDetails(null);
    setMemberList([]);
    setDetailError("");
    setDetailLoading(true);
    setShowModal(true);
    try {
      const res = await api.post("/family/getFamilyRegistrationDetails", { familyRequestId });
      setRegistrationDetails(res.data.registrationDetails ?? null);
      setMemberList(res.data.memberList ?? []);
    } catch (err) {
      if (err.response?.data?.operationMessage) {
        setDetailError(err.response.data.operationMessage);
      } else {
        setDetailError(ERROR_MESSAGES.DEFAULT);
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRegistrationDetails(null);
    setMemberList([]);
    setDetailError("");
    setActionError("");
    setActionSuccess("");
  };

  const ACTIONS = ["APPROVE", "DENY", "DUPLICATE", "INVALID"];

  const handleAction = async (action) => {
    setActionError("");
    setActionSuccess("");
    setActionLoading(true);
    try {
      const res = await api.post("/family/processFamilyRegistrationRequest", {
        familyRegistrationId: registrationDetails.familyRequestId,
        action,
      });
      const message = res.data?.operationMessage || `Request ${action.toLowerCase()}d successfully.`;
      setActionSuccess(message);
      setRegistrationDetails((prev) => ({ ...prev, status: action === "APPROVE" ? "PROCESSED" : action }));
      setResults((prev) => {
        if (!prev) return prev;
        const updated = (prev.registrations ?? prev).map((r) =>
          r.familyRequestId === registrationDetails.familyRequestId
            ? { ...r, status: action === "APPROVE" ? "PROCESSED" : action }
            : r
        );
        return prev.registrations ? { ...prev, registrations: updated } : updated;
      });
    } catch (err) {
      if (err.response?.data?.operationMessage) {
        setActionError(err.response.data.operationMessage);
      } else {
        setActionError(ERROR_MESSAGES.DEFAULT);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const registrations = Array.isArray(results)
    ? results
    : results?.registrations ?? results?.families ?? [];

  const d = registrationDetails;

  return (
    <div className="container p-4 bg-white rounded mt-4">
      <h2 className="mb-4">Family Registration Management</h2>
      <form onSubmit={handleSearch} className="mb-3">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Registration Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary w-100" type="submit">
              Search
            </button>
          </div>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}
      {hasSearched && !registrations.length && !error && (
        <div className="alert alert-danger">
          No registrations found for selected status
        </div>
      )}

      {registrations.length > 0 && (
        <>
          <div className="mb-2">
            <small className="text-muted">{registrations.length} registration(s) found</small>
          </div>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Family Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Status</th>
                <th>Registration Date</th>
                <th>Family ID</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r, idx) => (
                <tr
                  key={r.familyRequestId ?? idx}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(r.familyRequestId)}
                >
                  <td className="text-primary text-decoration-underline">{r.familyRequestId ?? "-"}</td>
                  <td>
                    <span className="text-primary text-decoration-underline">
                      {r.familyName}
                      {r.familyNameInHindi && ` (${r.familyNameInHindi})`}
                    </span>
                  </td>
                  <td>{r.email ?? "-"}</td>
                  <td>{r.phone ?? "-"}</td>
                  <td>{r.city ?? "-"}</td>
                  <td>
                    <span className={`badge ${statusBadgeClass(r.status)}`}>{r.status}</span>
                  </td>
                  <td>
                    {r.registrationDate
                      ? new Date(r.registrationDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{r.familyId ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {d ? `${d.familyName}${d.familyNameInHindi ? ` (${d.familyNameInHindi})` : ""} — Registration Details` : "Registration Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailLoading && (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          )}
          {detailError && <div className="alert alert-danger">{detailError}</div>}

          {d && (
            <>
              {/* Family Info — mirrors FamilyDetails card layout */}
              <div className="card mb-4 p-4 bg-body-secondary border-0">
                <div className="row">
                  {/* Col 1: Name / Head / Gotra / Contact */}
                  <div className="col-sm-4">
                    <h4 className="fw-bold mb-3">
                      {d.familyName}
                      {d.familyNameInHindi && ` (${d.familyNameInHindi})`}
                    </h4>
                    {d.headOfFamilyName && (
                      <div className="mb-2">
                        <span className="fw-bold me-2">Head Of Family:</span>
                        <span>{d.headOfFamilyName}</span>
                      </div>
                    )}
                    {d.gotra && (
                      <div className="mb-2">
                        <span className="fw-bold me-2">Gotra:</span>
                        <span>{d.gotra}</span>
                      </div>
                    )}
                    {d.email && (
                      <div className="mb-2">
                        <span className="fw-bold me-2">Email:</span>
                        <span>{d.email}</span>
                      </div>
                    )}
                    {d.phone && (
                      <div className="mb-2">
                        <span className="fw-bold me-2">Phone:</span>
                        <span>{d.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Col 2: Address */}
                  <div className="col-sm-4">
                    <div className="d-flex mt-2">
                      <span className="fw-semibold me-2">Address:</span>
                      <address className="mb-0">
                        {d.addressLine1}
                        {d.addressLine2 && <><br />{d.addressLine2}</>}
                        {d.addressLine3 && <><br />{d.addressLine3}</>}
                        {d.district && <><br />District: {d.district}</>}
                        <br />
                        {d.city}, {d.state} - {d.postalCode}
                        <br />
                        {d.country}
                      </address>
                    </div>
                  </div>

                  {/* Col 3: Registration meta */}
                  <div className="col-sm-4">
                    <div className="mb-2">
                      <span className="fw-bold me-2">Request ID:</span>
                      <span>{d.familyRequestId}</span>
                    </div>
                    <div className="mb-2">
                      <span className="fw-bold me-2">Status:</span>
                      <span className={`badge ${statusBadgeClass(d.status)}`}>{d.status}</span>
                    </div>
                    {d.familyId && (
                      <div className="mb-2">
                        <span className="fw-bold me-2">Family ID:</span>
                        <span>{d.familyId}</span>
                      </div>
                    )}
                    {d.registrationDate && (
                      <div className="mb-2">
                        <span className="fw-bold me-2">Registration Date:</span>
                        <span>{new Date(d.registrationDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action feedback */}
              {actionError && <div className="alert alert-danger mt-3">{actionError}</div>}
              {actionSuccess && <div className="alert alert-success mt-3">{actionSuccess}</div>}

              {/* Members Table */}
              {memberList.length > 0 && (
                <div className="mb-4">
                  <h5 className="mb-3">Family Members</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Relationship</th>
                          <th>Gender</th>
                          <th>Birth Date</th>
                          <th>Marital Status</th>
                          <th>Phone</th>
                          <th>Education</th>
                          <th>Occupation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {memberList.map((m) => (
                          <tr key={m.memberId}>
                            <td>
                              {m.firstName}
                              {m.firstNameInHindi && <><br />{m.firstNameInHindi}</>}
                            </td>
                            <td>{m.familyRelationship ?? "-"}</td>
                            <td>{m.gender ?? "-"}</td>
                            <td>{m.birthDate ?? "-"}</td>
                            <td>{m.maritalStatus ?? "-"}</td>
                            <td>{m.phone ?? "-"}</td>
                            <td>{m.educationDetails ?? "-"}</td>
                            <td>{m.occupation ?? "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {d?.status === "PENDING" && (
            <>
              {ACTIONS.map((action) => (
                <Button
                  key={action}
                  variant={
                    action === "APPROVE" ? "success"
                    : action === "DENY" ? "danger"
                    : action === "DUPLICATE" ? "info"
                    : "warning"
                  }
                  disabled={actionLoading}
                  onClick={() => handleAction(action)}
                >
                  {action.charAt(0) + action.slice(1).toLowerCase()}
                </Button>
              ))}
            </>
          )}
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FamilyRegistrationManagement;
