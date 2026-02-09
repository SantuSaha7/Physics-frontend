"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import "@/styles/result.css";

export default function PanelResultsPage() {
  const [results, setResults] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH CLASSES ================= */
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get("/classes");
        setClasses(Array.isArray(res) ? res : []);
      } catch (e) {
        console.error("Class load error", e);
      }
    };

    fetchClasses();
  }, []);

  /* ================= FETCH RESULTS (ONLY AFTER CLASS SELECT) ================= */
  useEffect(() => {
    if (!selectedClass) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(
          `/panel/results?classId=${selectedClass}`
        );

        setResults(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Panel results error:", err);
        setError("Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedClass]);

  return (
    <div
      className="result-page"
      style={{
        padding: "32px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* ===== HEADER ===== */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ marginBottom: 6 }}>Mock Test Results</h1>
        <p style={{ opacity: 0.7 }}>
          Select a class to view mock-wise performance
        </p>
      </div>

      {/* ===== CLASS FILTER (ONLY OPTION) ===== */}
      <div style={{ marginBottom: 20 }}>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            background: "#020617",
            color: "#e5e7eb",
            border: "1px solid #334155",
            minWidth: 240,
          }}
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* ===== STATES ===== */}
      {!selectedClass && (
        <p style={{ opacity: 0.7 }}>
          Please select a class to view results.
        </p>
      )}

      {loading && <p style={{ padding: 12 }}>Loading…</p>}

      {error && <p style={{ padding: 12, color: "red" }}>{error}</p>}

      {!loading && selectedClass && results.length === 0 && (
        <p style={{ opacity: 0.7 }}>No results found for this class.</p>
      )}

      {/* ===== RESULTS TABLE ===== */}
      {!loading && results.length > 0 && (
        <div
          style={{
            background: "#0f172a",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <table
            className="result-table"
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#020617",
                  textTransform: "uppercase",
                  fontSize: 13,
                  letterSpacing: "0.05em",
                }}
              >
                <th style={th}>Mock Title</th>
                <th style={thCenter}>Attempts</th>
                <th style={thCenter}>Avg Score</th>
                <th style={thCenter}>Avg %</th>
                <th style={thCenter}>Action</th>
              </tr>
            </thead>

            <tbody>
              {results.map((r) => {
                const avgScore =
                  typeof r.avgScore === "number" ? r.avgScore : 0;

                const avgPercentage =
                  typeof r.avgPercentage === "number"
                    ? r.avgPercentage
                    : 0;

                const percentageColor =
                  avgPercentage >= 75
                    ? "#22c55e"
                    : avgPercentage >= 40
                    ? "#facc15"
                    : "#ef4444";

                return (
                  <tr
                    key={r.mockId}
                    style={{ borderBottom: "1px solid #1e293b" }}
                  >
                    <td style={td}>
                      <strong>{r.title || "N/A"}</strong>
                    </td>

                    <td style={tdCenter}>{r.totalAttempts ?? 0}</td>

                    <td style={tdCenter}>{avgScore}</td>

                    <td
                      style={{
                        ...tdCenter,
                        color: percentageColor,
                        fontWeight: 700,
                      }}
                    >
                      {avgPercentage}%
                    </td>

                    <td style={tdCenter}>
                      <Link
                        href={`/panel/results/${r.mockId}?classId=${selectedClass}`}
                      >
                        <button
                          style={{
                            padding: "6px 14px",
                            borderRadius: 6,
                            border: "1px solid #334155",
                            background: "#020617",
                            color: "#e5e7eb",
                            cursor: "pointer",
                          }}
                        >
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const th = {
  padding: "14px 16px",
  textAlign: "left",
  fontWeight: 600,
};

const thCenter = {
  ...th,
  textAlign: "center",
};

const td = {
  padding: "14px 16px",
  fontSize: 15,
};

const tdCenter = {
  ...td,
  textAlign: "center",
};
