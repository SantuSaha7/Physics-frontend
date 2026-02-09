"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api"; // ✅ already exists in project

export default function ChapterDetailPage() {
  const { chapterId } = useParams();
  const router = useRouter();

  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        /**
         * ✅ FIX 1:
         * student can ONLY access `/chapters/student`
         * so we fetch all student chapters and filter by id
         */
        const res = await api.get("/chapters/student");

        if (!Array.isArray(res)) {
          throw new Error("Invalid chapter data");
        }

        const found = res.find(
          (c) => c._id === chapterId
        );

        if (!found) {
          throw new Error("Chapter not found");
        }

        setChapter(found);
      } catch (err) {
        console.error("Chapter detail error:", err);
        setError(err.message || "Failed to load chapter");
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId]);

  /* ================= UI STATES ================= */

  if (loading) {
    return <p style={{ padding: 20 }}>Loading chapter...</p>;
  }

  if (error) {
    return (
      <p style={{ color: "red", padding: 20 }}>
        {error}
      </p>
    );
  }

  if (!chapter) {
    return (
      <p style={{ padding: 20 }}>
        Chapter not found
      </p>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <button
        onClick={() => router.back()}
        style={{
          marginBottom: 16,
          background: "transparent",
          border: "none",
          color: "#60a5fa",
          cursor: "pointer",
        }}
      >
        ← Back to chapters
      </button>

      <h1 style={{ marginBottom: 20 }}>
        {chapter.title}
      </h1>

      {Array.isArray(chapter.topics) &&
      chapter.topics.length === 0 ? (
        <p style={{ opacity: 0.7 }}>
          No topics available for this chapter.
        </p>
      ) : (
        chapter.topics?.map((topic, index) => (
          <div
            key={index}
            style={{
              background: "#0f172a",
              padding: "16px 18px",
              borderRadius: "14px",
              marginBottom: "14px",
              border: "1px solid #334155",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{topic.name}</span>

            {topic.pdfLink && (
              <a
                href={topic.pdfLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "8px 14px",
                  background: "#2563eb",
                  color: "#fff",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontSize: 14,
                }}
              >
                📄 Open PDF
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
}
