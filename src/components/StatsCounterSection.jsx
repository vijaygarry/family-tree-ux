import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";
import AnimatedCounter from "./AnimatedCounter";

const STAT_LINKS = {
  single_boys: "/searchMember?gender=Male&maritalStatus=Single&ageFrom=21",
  single_girls: "/searchMember?gender=Female&maritalStatus=Single&ageFrom=21",
};

export default function StatsCounterSection() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.post("/family/getSamajStats", { samajId: 1 });
        if (response.data && response.data.statistics) {
          setStats(response.data.statistics);
        }
      } catch (err) {
        console.error("Failed to fetch samaj stats:", err);
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "24px" }}>
        Loading statistics...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "24px", color: "#dc3545" }}>
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "24px",
        textAlign: "center",
        padding: "24px",
      }}
    >
      {stats.map((s, i) => {
        const link = STAT_LINKS[s.key];
        const card = (
          <div
            style={{
              padding: "16px",
              borderRadius: "16px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              background: "#fff",
              cursor: link ? "pointer" : "default",
            }}
          >
            <div style={{ fontSize: 40, fontWeight: 800, color: "#A42502" }}>
              <AnimatedCounter
                target={s.value}
                duration={1500}
                startOnView={true}
                once={true}
                suffix=""
                decimals={0}
              />
            </div>
            <div style={{ marginTop: 8, color: link ? "#A42502" : "#000", fontWeight: 600 }}>
              {s.label}
            </div>
          </div>
        );

        return link ? (
          <Link key={s.key || i} to={link} style={{ textDecoration: "none" }}>
            {card}
          </Link>
        ) : (
          <div key={s.key || i}>{card}</div>
        );
      })}
    </div>
  );
}
