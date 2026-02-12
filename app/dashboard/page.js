"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function DashboardHome() {
  const [className, setClassName] = useState("");
  const [fees, setFees] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/auth/me");

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

  /* ================= LOAD FEES ================= */
  useEffect(() => {
    const loadFees = async () => {
      try {
        const res = await api.get(`/fees/my?year=${year}`);
        setFees(res);
      } catch (err) {
        console.error("Failed to load fees:", err);
      }
    };

    loadFees();
  }, [year]);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  return (
    <div className="dashboard-home">
      {/* HEADER */}
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

      {/* DASHBOARD CARDS */}
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

      {/* ================= FEES SECTION ================= */}
      <div
        style={{
          marginTop: 40,
          padding: 20,
          borderRadius: 16,
          background: "#0f172a",
          border: "1px solid #334155",
        }}
      >
        <h2 style={{ marginBottom: 15 }}>💰 Yearly Fees ({year})</h2>

        <div style={{ marginBottom: 15 }}>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{
              padding: 8,
              borderRadius: 8,
              background: "#020617",
              border: "1px solid #334155",
              color: "#fff",
            }}
          />
        </div>

        {!fees ? (
          <p>No fee data available.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(120px,1fr))",
              gap: 10,
            }}
          >
            {fees.months?.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  textAlign: "center",
                  background: m.paid
                    ? "#14532d"
                    : "#7f1d1d",
                  border: "1px solid #334155",
                }}
              >
                <div style={{ fontSize: 13 }}>
                  {monthNames[m.month - 1]}
                </div>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  {m.paid ? "Paid" : "Unpaid"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
