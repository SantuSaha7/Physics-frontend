"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function ChaptersPage() {
  const [chapters, setChapters] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadChapters = async () => {
      try {
        const res = await api.get("/chapters/student");

        if (!Array.isArray(res)) {
          setChapters([]);
          return;
        }

        setChapters(res);
      } catch (err) {
        console.error("Student chapters load error:", err);
        setError("Failed to load chapters");
      }
    };

    loadChapters();
  }, []);

  if (error) {
    return (
      <p style={{ color: "red", padding: 20 }}>
        {error}
      </p>
    );
  }

  return (
    <div style={page}>
      <h1 style={title}>📚 Chapters</h1>

      {chapters.length === 0 && (
        <p style={{ opacity: 0.7 }}>
          No chapters available
        </p>
      )}

      <div style={grid}>
        {chapters.map((ch) => (
          <div
            key={ch._id}
            onClick={() =>
              router.push(`/dashboard/chapters/${ch._id}`)
            }
            style={card}
          >
            <h3 style={chapterTitle}>{ch.title}</h3>
            <span style={arrow}>→</span>

            {/* ⛔ kept but disabled (NO DELETE) */}
            {false && ch.class_id?.name}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: 24,
  maxWidth: 1000,
  margin: "0 auto",
};

const title = {
  fontSize: 26,
  marginBottom: 24,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 16,
};

const card = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: 14,
  padding: "22px 20px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "all 0.2s ease",
};

const chapterTitle = {
  margin: 0,
  fontSize: 18,
  fontWeight: 600,
};

const arrow = {
  fontSize: 22,
  opacity: 0.6,
};
