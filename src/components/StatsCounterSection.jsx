import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import AnimatedCounter from "./AnimatedCounter";

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
      {stats.map((s, i) => (
        <div
          key={s.key || i}
          style={{
            padding: "16px",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            background: "#fff",
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 800, color: "#A42502" }}>
            <AnimatedCounter
              target={s.value}
              duration={1500}
              startOnView={true}
              once={true}
              suffix="" // e.g., "+" if you want "579+"
              decimals={0}
            />
          </div>
          <div style={{ marginTop: 8, color: "#000", fontWeight: 600 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
