"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

export default function StudentMockResultDetail() {
  const { mockId, studentId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const classId = searchParams.get("classId");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mockId || !studentId) {
      setError("Invalid URL");
      setLoading(false);
      return;
    }

    let alive = true;

    const fetchResult = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ ✅ ✅ FINAL CORRECT ROUTE (MATCHES BACKEND)
        const url = classId
          ? `/results/panel/mock/${mockId}/student/${studentId}?classId=${classId}`
          : `/results/panel/mock/${mockId}/student/${studentId}`;

        const res = await api.get(url);

        if (!alive) return;

        if (!res) {
          setError("Result not found");
          setResult(null);
          return;
        }

        setResult(res);
      } catch (err) {
        console.error("Result detail fetch error:", err);
        if (alive) setError("Failed to load result detail");
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchResult();
    return () => {
      alive = false;
    };
  }, [mockId, studentId, classId]);

  if (loading) return <p style={{ padding: 20 }}>Loading result…</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>;

  const student = result.student || {};
  const mock = result.mock || {};
  const answers = Array.isArray(result.answers) ? result.answers : [];

  const correct =
    typeof result.correct === "number"
      ? result.correct
      : answers.filter((a) => a.isCorrect).length;

  const attempted = answers.filter(
    (a) => a.selectedIndex !== null && a.selectedIndex !== undefined
  ).length;

  const wrong =
    typeof result.wrong === "number"
      ? result.wrong
      : Math.max(attempted - correct, 0);

  const total = answers.length;

  const percentage =
    typeof result.percentage === "number"
      ? result.percentage
      : total > 0
      ? Math.round((correct / total) * 100)
      : 0;

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "auto" }}>
      <div style={summaryCard}>
        <div>
          <h2 style={{ marginBottom: 6 }}>
            {student.name || result.studentName || "Unknown Student"}
          </h2>

          <p style={{ color: "#9ca3af" }}>
            Mock: <b>{mock.title || "N/A"}</b>
          </p>

          {result.className && (
            <p style={{ color: "#9ca3af", fontSize: 13 }}>
              Class: <b>{result.className}</b>
            </p>
          )}
        </div>

        <div style={statsRow}>
          <Stat label="Correct" value={correct} color="#16a34a" />
          <Stat label="Wrong" value={wrong} color="#dc2626" />
          <Stat label="Percentage" value={`${percentage}%`} color="#2563eb" />
        </div>

        <button onClick={() => router.back()} style={backBtn}>
          ⬅ Back
        </button>
      </div>

      <h3 style={{ marginBottom: 12 }}>Question-wise Status</h3>

      {answers.length === 0 ? (
        <p>No answers found.</p>
      ) : (
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Question</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((a, idx) => {
                let badge = badgeNA;
                let text = "Not Attempted";

                if (a.selectedIndex != null) {
                  if (a.isCorrect) {
                    badge = badgeCorrect;
                    text = "Correct";
                  } else {
                    badge = badgeWrong;
                    text = "Wrong";
                  }
                }

                return (
                  <tr key={a.question?._id || idx}>
                    <td style={td}>
                      <b>Q{idx + 1}.</b>{" "}
                      {a.question?.question || "Question"}
                    </td>
                    <td style={td}>
                      <span style={badge}>{text}</span>
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

/* ================= styles ================= */

function Stat({ label, value, color }) {
  return (
    <div style={statCard}>
      <div style={{ fontSize: 22, fontWeight: "bold", color }}>{value}</div>
      <div style={{ fontSize: 13, color: "#9ca3af" }}>{label}</div>
    </div>
  );
}

const summaryCard = {
  background: "#020617",
  color: "#fff",
  padding: 20,
  borderRadius: 12,
  marginBottom: 28,
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const statsRow = { display: "flex", gap: 16, flexWrap: "wrap" };
const statCard = {
  background: "#020617",
  border: "1px solid #1e293b",
  padding: "12px 18px",
  borderRadius: 10,
  minWidth: 120,
};

const backBtn = {
  alignSelf: "flex-start",
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  background: "#1e293b",
  color: "#fff",
};

const tableWrap = {
  background: "#020617",
  borderRadius: 12,
  overflow: "hidden",
  border: "1px solid #1e293b",
};

const table = { width: "100%", borderCollapse: "collapse" };
const th = {
  padding: 14,
  borderBottom: "1px solid #1e293b",
  textAlign: "left",
  color: "#9ca3af",
};
const td = {
  padding: 14,
  borderBottom: "1px solid #1e293b",
  color: "#e5e7eb",
};

const badgeBase = {
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: "bold",
};
const badgeCorrect = { ...badgeBase, background: "#16a34a", color: "#fff" };
const badgeWrong = { ...badgeBase, background: "#dc2626", color: "#fff" };
const badgeNA = { ...badgeBase, background: "#374151", color: "#e5e7eb" };
