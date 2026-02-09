"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    classes: 0,
    chapters: 0,
    mocks: 0,
    students: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get("/panel/stats");

        if (res) {
          setStats({
            classes: res.classes ?? 0,
            chapters: res.chapters ?? 0,
            mocks: res.mocks ?? 0,
            students: res.students ?? 0,
          });
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <p style={{ color: "#cbd5f5" }}>
        Loading dashboard...
      </p>
    );
  }

  return (
    <div style={{ padding: "10px 4px" }}>
      <h2
        style={{
          fontSize: "26px",
          fontWeight: "600",
          marginBottom: "24px",
          color: "#e5e7eb",
        }}
      >
        📊 Dashboard Overview
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        <StatCard
          title="Total Classes"
          value={stats.classes}
          color="#38bdf8"
        />
        <StatCard
          title="Total Chapters"
          value={stats.chapters}
          color="#a78bfa"
        />
        <StatCard
          title="Mock Tests"
          value={stats.mocks}
          color="#fbbf24"
        />
        <StatCard
          title="Students"
          value={stats.students}
          color="#4ade80"
        />
      </div>
    </div>
  );
}

/* ===============================
   REUSABLE STAT CARD (UI FIX)
================================ */
function StatCard({ title, value, color }) {
  return (
    <div
      style={{
        padding: "22px",
        borderRadius: "14px",
        background:
          "linear-gradient(145deg, #0f172a, #020617)",
        border: "1px solid #1e293b",
        boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 18px 40px rgba(0,0,0,0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 10px 25px rgba(0,0,0,0.4)";
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "14px",
          color: "#94a3b8",
          letterSpacing: "0.3px",
        }}
      >
        {title}
      </p>

      <p
        style={{
          marginTop: "10px",
          fontSize: "36px",
          fontWeight: "700",
          color,
        }}
      >
        {value}
      </p>
    </div>
  );
}
