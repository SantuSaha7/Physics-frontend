"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function MockListPage() {
  const [mocks, setMocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= LOAD MOCKS ================= */
  useEffect(() => {
    let mounted = true;

    const loadMocks = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/mocks");

        // ✅ HARD SAFE NORMALIZATION (STUDENT SAFE)
        const data = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.mocks)
          ? res.data.mocks
          : Array.isArray(res?.mocks)
          ? res.mocks
          : [];

        if (mounted) {
          setMocks(data);
        }
      } catch (err) {
        console.error("Failed to load mocks", err);
        if (mounted) {
          setMocks([]);
          setError("Failed to load mock tests");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadMocks();

    return () => {
      mounted = false;
    };
  }, []);

  /* ================= UI ================= */
  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        📝 Mock Tests
      </h1>

      {loading && <p>Loading mock tests...</p>}

      {!loading && error && (
        <p style={{ color: "#f87171" }}>{error}</p>
      )}

      {!loading && !error && mocks.length === 0 && (
        <p>No mock tests available.</p>
      )}

      {!loading &&
        mocks.map((test) => (
          <div
            key={test._id}
            style={{
              background: "#0f172a",
              padding: "20px",
              borderRadius: "14px",
              marginBottom: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            }}
          >
            <h3 style={{ fontSize: "20px", marginBottom: "6px" }}>
              {test.title}
            </h3>

            <p>Time: {test.duration} minutes</p>

            <Link href={`/dashboard/mocks/${test._id}`}>
              <button className="start-test-btn">
                Start Test
              </button>
            </Link>
          </div>
        ))}
    </div>
  );
}
