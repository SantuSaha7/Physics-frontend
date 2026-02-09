"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ChaptersPage() {
  const [classes, setClasses] = useState([]);
  const [chapters, setChapters] = useState([]);

  // create chapter
  const [title, setTitle] = useState("");
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);

  // filter
  const [filterClassId, setFilterClassId] = useState("");

  /* ================= LOAD DATA ================= */
  const loadClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(Array.isArray(res) ? res : []);
    } catch {
      setClasses([]);
    }
  };

  const loadChapters = async () => {
    try {
      const res = await api.get("/chapters");
      setChapters(Array.isArray(res) ? res : []);
    } catch {
      setChapters([]);
    }
  };

  useEffect(() => {
    loadClasses();
    loadChapters();
  }, []);

  /* ================= CREATE CHAPTER ================= */
  const createChapter = async () => {
    if (!title.trim() || !classId) {
      return alert("Chapter title and class required");
    }

    try {
      setLoading(true);
      await api.post("/chapters", {
        title: title.trim(),
        class_id: classId,
        topics: [],
      });

      setTitle("");
      setClassId("");
      await loadChapters();
    } catch {
      alert("Failed to create chapter");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTERED CHAPTERS ================= */
  const visibleChapters = filterClassId
    ? chapters.filter(
        (c) => (c.class_id?._id || c.class_id) === filterClassId
      )
    : chapters;

  return (
    <div style={{ padding: 28, maxWidth: 1100 }}>
      <h1 style={titleStyle}>📚 Chapter Management</h1>

      {/* CREATE CHAPTER */}
      <div style={card}>
        <h3>Create Chapter</h3>

        <input
          style={input}
          placeholder="Chapter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          style={input}
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          style={primaryBtn}
          onClick={createChapter}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Chapter"}
        </button>
      </div>

      {/* CREATED CHAPTERS */}
      <div style={{ marginTop: 40 }}>
        <h2>Created Chapters</h2>

        <select
          style={input}
          value={filterClassId}
          onChange={(e) => setFilterClassId(e.target.value)}
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {visibleChapters.length === 0 ? (
          <p style={{ marginTop: 16, opacity: 0.7 }}>
            No chapters found.
          </p>
        ) : (
          visibleChapters.map((ch) => (
            <ChapterCard
              key={ch._id}
              chapter={ch}
              reload={loadChapters}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ================= CHAPTER CARD ================= */

function ChapterCard({ chapter, reload }) {
  const [topicName, setTopicName] = useState("");
  const [pdfLink, setPdfLink] = useState("");

  /* ADD TOPIC */
  const addTopic = async () => {
    if (!topicName.trim() || !pdfLink.trim()) {
      return alert("Topic name and PDF link required");
    }

    const updatedTopics = [
      ...(chapter.topics || []),
      { name: topicName.trim(), pdfLink: pdfLink.trim() },
    ];

    try {
      await api.put(`/chapters/${chapter._id}`, {
        title: chapter.title,
        class_id: chapter.class_id?._id || chapter.class_id,
        topics: updatedTopics,
      });

      setTopicName("");
      setPdfLink("");
      reload();
    } catch {
      alert("Failed to add topic");
    }
  };

  /* DELETE TOPIC (CONFIRMATION) */
  const deleteTopic = async (index) => {
    const ok = window.confirm(
      "Are you sure you want to delete this topic?\nThis action cannot be undone."
    );
    if (!ok) return;

    const updatedTopics = chapter.topics.filter(
      (_, i) => i !== index
    );

    try {
      await api.put(`/chapters/${chapter._id}`, {
        title: chapter.title,
        class_id: chapter.class_id?._id || chapter.class_id,
        topics: updatedTopics,
      });

      reload();
    } catch {
      alert("Failed to delete topic");
    }
  };

  /* DELETE CHAPTER (STRONG CONFIRMATION) */
  const deleteChapter = async () => {
    const ok = window.confirm(
      "⚠️ WARNING!\n\nDeleting this chapter will permanently remove:\n• The chapter\n• All its topics\n\nDo you want to continue?"
    );
    if (!ok) return;

    try {
      await api.delete(`/chapters/${chapter._id}`);
      reload();
    } catch {
      alert("Failed to delete chapter");
    }
  };

  return (
    <div style={card}>
      {/* HEADER */}
      <div style={chapterHeader}>
        <h3>
          {chapter.title}{" "}
          <span style={{ opacity: 0.7 }}>
            ({chapter.class_id?.name})
          </span>
        </h3>

        <button style={deleteChapterBtn} onClick={deleteChapter}>
          Delete Chapter
        </button>
      </div>

      {/* TOPICS */}
      <div style={topicBox}>
        <h4>Topics</h4>

        {chapter.topics?.length === 0 && (
          <p style={{ opacity: 0.7 }}>No topics yet</p>
        )}

        {chapter.topics?.map((t, i) => (
          <div key={i} style={topicRow}>
            <span>{t.name}</span>
            <button
              style={dangerBtn}
              onClick={() => deleteTopic(i)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ADD TOPIC */}
      <div style={{ marginTop: 16 }}>
        <h4>Add Topic</h4>

        <input
          style={input}
          placeholder="Topic name"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
        />

        <input
          style={input}
          placeholder="Google Drive PDF link"
          value={pdfLink}
          onChange={(e) => setPdfLink(e.target.value)}
        />

        <button style={secondaryBtn} onClick={addTopic}>
          Add Topic
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const titleStyle = { fontSize: 26, marginBottom: 20 };

const card = {
  background: "#0f172a",
  color: "#fff",
  padding: 22,
  borderRadius: 16,
  marginTop: 20,
};

const chapterHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const deleteChapterBtn = {
  background: "transparent",
  color: "#ef4444",
  border: "1px solid #ef4444",
  borderRadius: 10,
  padding: "6px 14px",
  cursor: "pointer",
};

const input = {
  width: "100%",
  padding: 14,
  marginTop: 10,
  borderRadius: 12,
  border: "1px solid #334155",
  background: "#020617",
  color: "#fff",
};

const topicBox = {
  background: "#020617",
  padding: 14,
  borderRadius: 12,
  marginTop: 14,
};

const topicRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 8,
};

const primaryBtn = {
  marginTop: 14,
  padding: "12px 22px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  cursor: "pointer",
};

const secondaryBtn = {
  marginTop: 10,
  padding: "10px 18px",
  background: "#334155",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

const dangerBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "6px 14px",
  cursor: "pointer",
};
