import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axiosInstance";
import AnimatedCounter from "../components/AnimatedCounter";
import ERROR_MESSAGES from "../constants/messages";

const FamiliesByCityPage = () => {
  const [cityStats, setCityStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [families, setFamilies] = useState(null);
  const [familiesLoading, setFamiliesLoading] = useState(false);
  const [familiesError, setFamiliesError] = useState(null);
  const navigate = useNavigate();
  const familiesRef = useRef(null);

  useEffect(() => {
    fetchCityStats();
  }, []);

  const fetchCityStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post("/family/getFamilyCountByCity", {});
      setCityStats(response.data.cityFamilyCounts || []);
    } catch (err) {
      console.error("Error fetching city stats:", err);
      setError(err.response?.data?.operationMessage || ERROR_MESSAGES.DEFAULT);
    } finally {
      setLoading(false);
    }
  };

  const handleCityClick = async (city) => {
    setSelectedCity(city);
    setFamilies(null);
    setFamiliesError(null);
    setFamiliesLoading(true);
    try {
      const res = await api.post("/family/getFamiliesByRegion", {
        city: city.cityName,
        state: city.stateName,
        country: city.country || null,
      });
      setFamilies(res.data.families || []);
    } catch (err) {
      console.error("Error fetching families by region:", err);
      setFamiliesError(err.response?.data?.operationMessage || ERROR_MESSAGES.DEFAULT);
    } finally {
      setFamiliesLoading(false);
      setTimeout(() => familiesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  };

  const getTotalFamilies = () => cityStats.reduce((sum, city) => sum + city.familyCount, 0);
  const getTotalMembers = () => cityStats.reduce((sum, city) => sum + (city.memberCount || 0), 0);
  const getTotalCities = () => cityStats.length;

  if (loading) {
    return <div style={{ textAlign: "center", padding: "24px" }}>Loading city statistics...</div>;
  }

  if (error) {
    return <div style={{ textAlign: "center", padding: "24px", color: "#dc3545" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "24px" }}>
      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 800, color: "#A42502" }}>
            <AnimatedCounter target={getTotalCities()} duration={1500} startOnView={true} once={true} suffix="" decimals={0} />
          </div>
          <div style={{ color: "#000", fontWeight: 600, fontSize: "18px" }}>Total Cities</div>
        </div>
        <div
          style={{
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 800, color: "#A42502" }}>
            <AnimatedCounter target={getTotalFamilies()} duration={1500} startOnView={true} once={true} suffix="" decimals={0} />
          </div>
          <div style={{ color: "#000", fontWeight: 600, fontSize: "18px" }}>Total Families</div>
        </div>
        <div
          style={{
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 800, color: "#A42502" }}>
            <AnimatedCounter target={getTotalMembers()} duration={1500} startOnView={true} once={true} suffix="" decimals={0} />
          </div>
          <div style={{ color: "#000", fontWeight: 600, fontSize: "18px" }}>Total Members</div>
        </div>
      </div>

      {/* City Stats Table */}
      {cityStats.length === 0 ? (
        <div style={{ padding: "24px", color: "#6c757d" }}>No city data available yet.</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>City</th>
              <th>Families</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {cityStats.map((city, index) => (
              <tr
                key={city.cityName + index}
                style={{ cursor: "pointer" }}
                className={
                  selectedCity?.cityName === city.cityName &&
                  selectedCity?.stateName === city.stateName &&
                  selectedCity?.country === city.country
                    ? "table-active"
                    : ""
                }
                onClick={() => handleCityClick(city)}
              >
                <td>{city.cityName}, {city.stateName}, {city.country || ""}</td>
                <td>{city.familyCount}</td>
                <td>{city.memberCount ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Families for selected city */}
      {selectedCity && (
        <div className="mt-4" ref={familiesRef}>
          <h5>
            Families in {selectedCity.cityName}
            {selectedCity.stateName ? `, ${selectedCity.stateName}` : ""}
            {selectedCity.country ? `, ${selectedCity.country}` : ""}
          </h5>

          {familiesLoading && <div>Loading families...</div>}
          {familiesError && <div className="alert alert-danger">{familiesError}</div>}
          {families && families.length === 0 && !familiesLoading && (
            <div className="alert alert-info">No families found for this city.</div>
          )}

          {families && families.length > 0 && (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Head Of Family</th>
                  <th>Family Name</th>
                  <th>Gotra</th>
                </tr>
              </thead>
              <tbody>
                {families.map((family) => (
                  <tr
                    key={family.familyId}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/family/${family.familyId}`)}
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default FamiliesByCityPage;
