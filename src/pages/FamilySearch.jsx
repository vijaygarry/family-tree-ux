import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import ERROR_MESSAGES from "../constants/messages";

const PAGE_SIZE = 25;

const FamilySearch = () => {
  const [searchString, setSearchString] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleRowClick = (id) => {
    navigate(`/family/${id}`);
  };

    const handleSearch = (e) => {
    e?.preventDefault();
    fetchResults(searchString, 0);
  };

  const fetchResults = async (query, page) => {
    try {
      const res = await api.post("/family/searchfamily", {
        searchString: query,
        page,
        pageSize: PAGE_SIZE,
      });
      setHasSearched(true);
      setResults(res.data);
      setError(null);
    } catch (err) {
      console.error("Search failed to load family details", err);
      if (err.response?.data?.operationMessage) {
        setError(err.response.data.operationMessage);
      } else {
        setError(ERROR_MESSAGES.DEFAULT);
      }
    }
  };


  const handlePageChange = (newPage) => {
    fetchResults(searchString, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { families, page, totalCount, totalPages } = results ?? {};
  const start = results ? page * PAGE_SIZE + 1 : 0;
  const end = results ? Math.min((page + 1) * PAGE_SIZE, totalCount) : 0;

  return (
    <div className="container p-4 bg-white rounded mt-4">
      <h2 className="mb-4">Search Family</h2>
      <form onSubmit={handleSearch} className="mb-3">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search Family"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary w-100" type="submit">
              Search
            </button>
          </div>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}
      {hasSearched && !families?.length && !error && (
        <div className="alert alert-danger">
          No family found for selected search criteria
        </div>
      )}

      {families?.length > 0 && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">
              Showing {start}–{end} of {totalCount} families
            </small>
          </div>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Head Of Family</th>
                <th>Family Name</th>
                <th>Gotra</th>
                <th>Phone</th>
                <th>Region</th>
              </tr>
            </thead>
            <tbody>
              {families.map((family) => (
                <tr
                  key={family.familyId}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(family.familyId)}
                >
                  <td>
                    {family.headOfFamilyFirstName}
                    {family.headOfFamilyFirstNameInHindi &&
                      ` (${family.headOfFamilyFirstNameInHindi})`}
                  </td>
                  <td>
                    {family.familyName}
                    {family.familyNameInHindi && ` (${family.familyNameInHindi})`}
                  </td>
                  <td>{family.gotra}</td>
                  <td>{family.phone}</td>
                  <td>{family.region}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item me-3 ${page === 0 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                  <li
                    key={p}
                    className={`page-item ${p === page ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => p !== page && handlePageChange(p)}
                    >
                      {p + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ms-3 ${page >= totalPages - 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default FamilySearch;
