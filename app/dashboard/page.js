"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function DashboardHome() {
  const [className, setClassName] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/auth/me");

        // ✅ SAFE NORMALIZATION (UNCHANGED LOGIC)
        const cls =
          res?.class?.name ??
          res?.classId?.name ??
          res?.class_id?.name ??
          "";

        setClassName(cls);
      } catch (err) {
        console.error("Failed to load student class:", err);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="dashboard-home">
      {/* 🔹 HEADER ROW */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <h1 className="dash-title">Student Dashboard</h1>
          <p className="dash-sub">
            Select a menu from left to continue your study.
          </p>
        </div>

        {/* 🎓 CLASS INFO CARD */}
        {className && (
          <div
            style={{
              padding: "14px 18px",
              borderRadius: 16,
              background:
                "linear-gradient(135deg, #0f172a, #1e293b)",
              border: "1px solid #334155",
              minWidth: 180,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 12,
                opacity: 0.7,
                marginBottom: 4,
              }}
            >
              Enrolled Class
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#38bdf8",
              }}
            >
              🎓 {className}
            </div>
          </div>
        )}
      </div>

      {/* 🔹 DASHBOARD CARDS */}
      <div className="dash-cards">
        <Link href="/dashboard/chapters" className="dash-card">
          <h3>📘 Chapters</h3>
          <p>Read chapter-wise theory & notes</p>
        </Link>

        <Link href="/dashboard/mocks" className="dash-card">
          <h3>📝 Mock Tests</h3>
          <p>Practice mock tests like real exam</p>
        </Link>

        <Link href="/dashboard/results" className="dash-card">
          <h3>📊 Results</h3>
          <p>Check performance & progress</p>
        </Link>
      </div>
    </div>
  );
}
