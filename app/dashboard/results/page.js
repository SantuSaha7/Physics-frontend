"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ResultPage() {
  const [latestResult, setLatestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Not logged in");
          return;
        }

        const res = await fetch("http://localhost:5001/api/results", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.message || "Failed to load results");
        }

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          setLatestResult(null);
          return;
        }

        // ✅ SAFE: pick latest by createdAt
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setLatestResult(sorted[0]);
      } catch (err) {
        console.error("Result fetch error:", err);
        setError(err.message || "Failed to load result");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div style={container}>
        <h2>Loading result...</h2>
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div style={container}>
        <h2 style={{ color: "#ef4444" }}>{error}</h2>
        <Link href="/dashboard">
          <button style={btn}>⬅ Back to Dashboard</button>
        </Link>
      </div>
    );
  }

  /* ================= NO RESULT ================= */

  if (!latestResult) {
    return (
      <div style={container}>
        <h2>No result found</h2>
        <Link href="/dashboard">
          <button style={btn}>⬅ Back to Dashboard</button>
        </Link>
      </div>
    );
  }

  /* ================= DATA NORMALIZATION ================= */

  const studentName =
    latestResult?.student?.name ||
    latestResult?.studentName ||
    latestResult?.user?.name ||
    "N/A";

  const totalQuestions = Number(latestResult.totalQuestions) || 0;
  const correct =
    typeof latestResult.correct === "number"
      ? latestResult.correct
      : Number(latestResult.score) || 0;

  const wrong =
    typeof latestResult.wrong === "number"
      ? latestResult.wrong
      : Math.max(totalQuestions - correct, 0);

  const percentage =
    typeof latestResult.percentage === "number"
      ? latestResult.percentage
      : totalQuestions > 0
      ? Math.round((correct / totalQuestions) * 100)
      : 0;

  const attemptedDate = latestResult.createdAt
    ? new Date(latestResult.createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  /* ================= UI ================= */

  return (
    <div style={container}>
      <h1 style={title}>📊 Test Results</h1>

      <div style={card}>
        <h2>{latestResult.mock?.title || "Mock Test"}</h2>

        <p style={{ marginBottom: "6px", opacity: 0.85 }}>
          👤 Student: <b>{studentName}</b>
        </p>

        <p style={scoreStyle}>
          {correct} / {totalQuestions}
        </p>

        <p style={{ color: "#22c55e", marginBottom: "6px" }}>
          ✅ Correct: {correct}
        </p>

        <p style={{ color: "#ef4444", marginBottom: "6px" }}>
          ❌ Wrong: {wrong}
        </p>

        <p style={{ marginBottom: "10px" }}>
          📈 Percentage: <b>{percentage}%</b>
        </p>

        <p style={{ opacity: 0.7 }}>
          Attempted on {attemptedDate}
        </p>

        <Link href="/dashboard">
          <button style={btn}>⬅ Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

/* ---------- styles ---------- */

const container = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#020617,#020617)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
};

const title = {
  position: "absolute",
  top: "30px",
  fontSize: "32px",
};

const card = {
  background: "#0f172a",
  padding: "40px",
  borderRadius: "16px",
  textAlign: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,.5)",
  minWidth: "320px",
};

const scoreStyle = {
  fontSize: "40px",
  margin: "20px 0",
  color: "#22c55e",
};

const btn = {
  marginTop: "20px",
  padding: "12px 30px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  background: "#2563eb",
  color: "#fff",
  fontSize: "16px",
};
