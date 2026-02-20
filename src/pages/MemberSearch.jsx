import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import ERROR_MESSAGES from "../constants/messages";
import { formatISODateToddMMMyyyy } from "../utils/formatUtils";

import {
    genderOptions,
    maritalStatusOptions,
} from "../constants/DropdownConstants";

const PAGE_SIZE = 25;

const MemberSearch = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        searchString: "",
        gender: "",
        maritalStatus: "",
        ageFrom: "",
        ageTo: "",
    });

    //const [members, setMembers] = useState([]);
    const [response, setResponse] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState(null);
    const [sortDir, setSortDir] = useState("asc"); // 'asc' or 'desc'

    const handleRowClick = (memberId) => {
        // navigate to member details (adjust route if your app uses a different path)
        navigate(`/member/${memberId}`);
    };

    const validateInt = (val) => {
        if (val === "" || val === null || val === undefined) return null;
        const n = parseInt(val, 10);
        return Number.isNaN(n) ? null : n;
    };

    const handleSearch = async (e) => {
        e?.preventDefault();
        setError(null);
        setLoading(true);
        setHasSearched(false);
        try {
            const body = {
                searchString: form.searchString || "",
                gender: form.gender || null,
                ageFrom: validateInt(form.ageFrom),
                ageTo: validateInt(form.ageTo),
                maritalStatus: form.maritalStatus || null,
            };

            const res = await api.post("/family/searchMember", body);
            setResponse(res.data);
            setCurrentPage(1);
            setHasSearched(true);
        } catch (err) {
            console.error("Search failed to load members", err);
            if (err.response?.data?.operationMessage) {
                setError(err.response.data.operationMessage);
            } else {
                setError(ERROR_MESSAGES?.DEFAULT || "Failed to fetch members");
            }
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.max(1, Math.ceil(response.members?.length / PAGE_SIZE));

    const getVisiblePageNumbers = () => {
        const total = totalPages;
        const current = currentPage;
        let start = Math.max(1, current - 2);
        let end = Math.min(total, start + 4);
        if (end - start < 4) {
            start = Math.max(1, end - 4);
        }
        const pages = [];
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    const handleSort = (column) => {
        if (!column) return;
        if (sortBy === column) {
            // toggle
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(column);
            setSortDir("asc");
            // reset to first page when sort changes
            setCurrentPage(1);
        }
    };

    // derive sorted members for display and pagination
    const sortedMembers = (response.members || []).slice();
    if (sortBy) {
        sortedMembers.sort((a, b) => {
            const aVal = a?.[sortBy];
            const bVal = b?.[sortBy];

            // handle numeric compare for age
            // if (sortBy === "age") {
            //     const na = Number(aVal ?? 0);
            //     const nb = Number(bVal ?? 0);
            //     return na - nb;
            // }

            // fallback string compare (case-insensitive)
            const sa = aVal == null ? "" : String(aVal).toLowerCase();
            const sb = bVal == null ? "" : String(bVal).toLowerCase();
            if (sa < sb) return -1;
            if (sa > sb) return 1;
            return 0;
        });

        if (sortDir === "desc") sortedMembers.reverse();
    }

    const displayed = sortedMembers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div className="container p-4 bg-white rounded mt-4">
            <h2 className="mb-4">Search Member</h2>

            <form onSubmit={handleSearch} className="mb-3">
                <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                        <label className="form-label"><span className="fw-semibold me-2">Name or City</span></label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name, city, country, phone, email"
                            aria-label="Search by name, city, country, phone, email"
                            value={form.searchString}
                            onChange={(e) => setForm({ ...form, searchString: e.target.value })}
                        />
                    </div>

                    <div className="col-md-2">
                        <label className="form-label"><span className="fw-semibold me-2">Gender</span></label>
                        <select
                            className="form-select"
                            value={form.gender}
                            onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        >
                            {genderOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>



                    <div className="col-md-2">
                        <label className="form-label"><span className="fw-semibold me-2">Marital Status</span></label>
                        <select
                            className="form-select"
                            value={form.maritalStatus}
                            onChange={(e) => setForm({ ...form, maritalStatus: e.target.value })}
                        >
                            {maritalStatusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}

                        </select>
                    </div>

                    <div className="col-md-1">
                        <label className="form-label"><span className="fw-semibold me-2">Age From</span></label>
                        <input
                            type="number"
                            min="0"
                            className="form-control"
                            value={form.ageFrom}
                            onChange={(e) => setForm({ ...form, ageFrom: e.target.value })}
                        />
                    </div>

                    <div className="col-md-1">
                        <label className="form-label"><span className="fw-semibold me-2">Age To</span></label>
                        <input
                            type="number"
                            min="0"
                            className="form-control"
                            value={form.ageTo}
                            onChange={(e) => setForm({ ...form, ageTo: e.target.value })}
                        />
                    </div>

                    <div className="col-md-1">
                        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </div>
            </form>

            {error && <div className="alert alert-danger">{error}</div>}

            {hasSearched && !loading && response.members == null && (
                <div className="alert alert-info">No member found with seach criteria</div>
            )}

            {displayed?.length > 0 && (
                <>
                    <div className="table-responsive">
                        <table className="table table-bordered mt-4">
                            <thead>
                                <tr>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("firstName")}>
                                        First name {sortBy === "firstName" && (sortDir === "asc" ? " ▲" : " ▼")}
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSort("lastName")}>
                                        Last Name {sortBy === "lastName" && (sortDir === "asc" ? " ▲" : " ▼")}
                                    </th>
                                    <th>
                                        Age
                                    </th>
                                    <th>
                                        Gender
                                    </th>
                                    <th>
                                        Marital Status
                                    </th>
                                    {/* <th style={{ cursor: "pointer" }} onClick={() => handleSort("region")}>
                                        Region {sortBy === "region" && (sortDir === "asc" ? " ▲" : " ▼")}
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {displayed.map((member) => (
                                    <tr key={member.memberId} style={{ cursor: "pointer" }} onClick={() => handleRowClick(member.memberId)}>
                                          <td data-label="Name">
                                            {member.firstName} 
                                            {member.firstNameInHindi && ` (${member.firstNameInHindi})`}
                                          </td>
                                          <td data-label="Last Name">
                                            {member.lastName}
                                          </td>
                                          <td data-label="Birth Date">
                                            {member.birthDate} <br />
                                            <p className="m-0 fs-10">{member.age}</p>
                                          </td>
                                          <td data-label="Gender">
                                            {member.gender}
                                          </td>
                                          <td data-label="Marital Status">
                                            {member.maritalStatus} <br />
                                            {member.weddingDate &&
                                              formatISODateToddMMMyyyy(member.weddingDate)}
                                          </td>
                                          {/* <td data-label="Region">
                                            {member.region}
                                          </td> */}
                                        </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            Showing {displayed.length} of {response.members?.length} records
                        </div>

                        <div className="btn-group" role="group" aria-label="Pagination">
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Prev
                            </button>

                            {getVisiblePageNumbers().map((p) => (
                                <button
                                    key={p}
                                    className={`btn ${p === currentPage ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => setCurrentPage(p)}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                className="btn btn-outline-primary"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>

                        <div>
                            Page {currentPage} of {totalPages}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MemberSearch;
