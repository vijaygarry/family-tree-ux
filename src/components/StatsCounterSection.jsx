import AnimatedCounter from "./AnimatedCounter";

const stats = [
  { value: 22, label: "Number of registered families" },
  { value: 140, label: "Number of registered Members" },
  { value: 19, label: "Registered Users" },
  { value: 80, label: "Number of Males" },
  { value: 60, label: "Number of Females" },
  { value: 24, label: "Kids (Under 20)" },
  { value: 5, label: "Single Girls (Above 20)" },
  { value: 13, label: "Single Boys (Above 20)" },
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
