"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState("");
  const [disablingId, setDisablingId] = useState(null);

  /* ================= LOAD CLASSES ================= */
  const loadClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(Array.isArray(res) ? res : []);
    } catch {
      setClasses([]);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  /* ================= CREATE CLASS ================= */
  const createClass = async () => {
    if (!className.trim()) return alert("Class name required");

    setLoading(true);
    await api.post("/classes/add", { name: className.trim() });
    setClassName("");
    await loadClasses();
    setLoading(false);
  };

  /* ================= LOAD STUDENTS ================= */
  const loadStudents = async (cls) => {
    setActiveClass(cls);
    try {
      const res = await api.get(`/panel/classes/${cls._id}/students`);
      setStudents(Array.isArray(res) ? res : []);
    } catch {
      setStudents([]);
    }
  };

  /* ================= COPY ================= */
  const copyCredentials = (s) => {
    const text = `Username: ${s.username}\nStudent ID: ${s.studentId}`;
    navigator.clipboard.writeText(text);
    alert("Copied ✔");
  };

  /* ================= DISABLE STUDENT ================= */
  const disableStudent = async (studentId) => {
    if (!confirm("Disable this student’s access?")) return;

    try {
      setDisablingId(studentId);

      // ✅ CORRECT API (route + method)
      await api.patch(`/classes/students/${studentId}/disable`);

      // ✅ instant UI update
      setStudents((prev) => prev.filter((s) => s._id !== studentId));
    } catch (err) {
      console.error(err);
      alert("Failed to disable student");
    } finally {
      setDisablingId(null);
    }
  };

  return (
    <div style={{ padding: 28, maxWidth: 1000 }}>
      <h1 style={title}>📘 Class Management</h1>

      {/* ADD CLASS */}
      <div style={card}>
        <h3>Add New Class</h3>
        <div style={{ display: "flex", gap: 14 }}>
          <input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Class name (e.g. Class 11)"
            style={input}
          />
          <button onClick={createClass} style={primaryBtn}>
            {loading ? "Adding..." : "Add Class"}
          </button>
        </div>
      </div>

      {/* CLASS LIST */}
      <div style={{ ...card, marginTop: 28 }}>
        <h3>Classes</h3>

        {classes.map((cls) => (
          <div
            key={cls._id}
            onClick={() => loadStudents(cls)}
            style={{
              padding: "12px",
              marginTop: "10px",
              borderRadius: "10px",
              cursor: "pointer",
              background:
                activeClass?._id === cls._id ? "#1e293b" : "#020617",
            }}
          >
            <strong>{cls.name}</strong>
          </div>
        ))}
      </div>

      {/* STUDENTS */}
      {activeClass && (
        <div style={{ ...card, marginTop: 28 }}>
          <h3>Students of {activeClass.name}</h3>

          {students.length === 0 ? (
            <p style={{ opacity: 0.7 }}>No students found.</p>
          ) : (
            students.map((s) => (
              <div key={s._id} style={studentCard}>
                <div>
                  <b>{s.username}</b>
                  <div style={small}>Student ID: {s.studentId}</div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    style={copyBtn}
                    onClick={() => copyCredentials(s)}
                  >
                    Copy
                  </button>

                  <button
                    style={dangerBtn}
                    disabled={disablingId === s._id}
                    onClick={() => disableStudent(s._id)}
                  >
                    {disablingId === s._id ? "Disabling..." : "Disable"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const title = {
  fontSize: 26,
  marginBottom: 24,
};

const card = {
  background: "#0f172a",
  color: "#fff",
  padding: 22,
  borderRadius: 16,
  boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
};

const input = {
  flex: 1,
  padding: 14,
  borderRadius: 12,
  border: "1px solid #334155",
  background: "#020617",
  color: "#fff",
};

const primaryBtn = {
  padding: "14px 22px",
  background: "#2563eb",
  border: "none",
  borderRadius: 12,
  color: "#fff",
  cursor: "pointer",
};

const studentCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 14,
  marginTop: 12,
  borderRadius: 12,
  background: "#020617",
  border: "1px solid #334155",
};

const small = {
  fontSize: 13,
  opacity: 0.8,
};

const copyBtn = {
  padding: "6px 14px",
  background: "#16a34a",
  border: "none",
  borderRadius: 8,
  color: "#fff",
  cursor: "pointer",
};

const dangerBtn = {
  padding: "6px 14px",
  background: "#dc2626",
  border: "none",
  borderRadius: 8,
  color: "#fff",
  cursor: "pointer",
};
