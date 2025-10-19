import React from "react";
import AnimatedCounter from "./AnimatedCounter";

const stats = [
  { value: 5, label: "Number of registered families" },
  { value: 24, label: "Number of registered Members" },
  { value: 4, label: "Registered Users" },
  { value: 13, label: "Number of Males" },
  { value: 11, label: "Number of Females" },
  { value: 3, label: "Kids (Under 20)" },
  { value: 0, label: "Single Girls (Above 20)" },
  { value: 2, label: "Single Boys (Above 20)" },
];

export default function StatsCounterSection() {
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
          key={i}
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
