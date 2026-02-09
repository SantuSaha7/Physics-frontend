"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import "@/styles/result.css";

export default function MockWiseStudentResults() {
  const { mockId } = useParams();
  const searchParams = useSearchParams();

  const classId = searchParams.get("classId"); // ✅ MUST be forwarded

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mockId) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const url = classId
          ? `/panel/results/mock/${mockId}?classId=${classId}`
          : `/panel/results/mock/${mockId}`;

        const res = await api.get(url);
        setResults(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Mock student results error:", err);
        setError("Failed to load student results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [mockId, classId]);

  if (loading) return <p style={{ padding: 24 }}>Loading student results…</p>;
  if (error) return <p style={{ padding: 24, color: "red" }}>{error}</p>;

  return (
    <div
      className="result-page"
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <h1 style={{ marginBottom: "24px" }}>Student Results</h1>

      {results.length === 0 ? (
        <p style={{ opacity: 0.7 }}>
          No student has attempted this mock yet.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            className="result-table"
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={th}>Student</th>
                <th style={th}>Correct</th>
                <th style={th}>Wrong</th>
                <th style={th}>Percentage</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {results.map((r) => {
                const total =
                  typeof r.totalQuestions === "number"
                    ? r.totalQuestions
                    : r.answers?.length || 0;

                const correct =
                  typeof r.correct === "number"
                    ? r.correct
                    : r.answers?.filter((a) => a.isCorrect).length || 0;

                const wrong =
                  typeof r.wrong === "number"
                    ? r.wrong
                    : Math.max(total - correct, 0);

                const percentage =
                  typeof r.percentage === "number"
                    ? r.percentage
                    : total > 0
                    ? Math.round((correct / total) * 100)
                    : 0;

                const percentageColor =
                  percentage >= 75
                    ? "#16a34a"
                    : percentage >= 40
                    ? "#facc15"
                    : "#dc2626";

                return (
                  <tr key={r._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={td}>
                      <strong>
                        {r.student?.name || r.studentName || "N/A"}
                      </strong>
                      {r.className && (
                        <div style={{ fontSize: 12, opacity: 0.7 }}>
                          {r.className}
                        </div>
                      )}
                    </td>

                    <td style={{ ...td, color: "#16a34a", fontWeight: 600 }}>
                      {correct}
                    </td>

                    <td style={{ ...td, color: "#dc2626", fontWeight: 600 }}>
                      {wrong}
                    </td>

                    <td
                      style={{
                        ...td,
                        color: percentageColor,
                        fontWeight: "bold",
                      }}
                    >
                      {percentage}%
                    </td>

                    <td style={td}>
                      {r.student?._id ? (
                        <Link
                          href={`/panel/results/${mockId}/student/${r.student._id}${
                            classId ? `?classId=${classId}` : ""
                          }`}
                          prefetch={false}
                        >
                          <button
                            style={{
                              padding: "8px 14px",
                              borderRadius: "6px",
                              border: "1px solid #334155",
                              background: "#0f172a",
                              color: "#fff",
                              cursor: "pointer",
                            }}
                          >
                            View
                          </button>
                        </Link>
                      ) : (
                        "—"
                      )}
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

/* ===== table helpers ===== */

const th = {
  textAlign: "left",
  padding: "14px 16px",
  fontWeight: 600,
  borderBottom: "2px solid #cbd5f5",
};

const td = {
  padding: "14px 16px",
  lineHeight: "1.6",
};
