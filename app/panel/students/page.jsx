"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export default function StudentsPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ created student info
  const [createdInfo, setCreatedInfo] = useState(null);

  const [form, setForm] = useState({
    username: "",
    password: "",
    classId: "",
  });

  /* ================= LOAD CLASSES ================= */
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await api.get("/classes");
        if (Array.isArray(res)) setClasses(res);
        else if (Array.isArray(res?.data)) setClasses(res.data);
        else setClasses([]);
      } catch (err) {
        console.error("Failed to load classes", err);
        setClasses([]);
      }
    };

    loadClasses();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitStudent = async () => {
    if (!form.username || !form.password || !form.classId) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/panel/students", form);

      if (!res?.student?.studentId && !res?.student?.id) {
        alert("Student created but Student ID missing");
        return;
      }

      // ✅ backend যেটা দিচ্ছে সেটাই ধরছি
      const studentId = res.student.studentId || res.student.id;

      // ✅ store info for display
      setCreatedInfo({
        studentId,
        password: form.password,
      });

      // reset form
      setForm({
        username: "",
        password: "",
        classId: "",
      });
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  /* ================= COPY HANDLER ================= */
  const copyCredentials = () => {
    if (!createdInfo) return;

    const text = `Student ID : ${createdInfo.studentId}\nPassword : ${createdInfo.password}`;
    navigator.clipboard.writeText(text);
    alert("Student credentials copied!");
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>Register Student</h2>

        {/* USERNAME */}
        <div style={field}>
          <label style={label}>Student Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
            style={input}
          />
        </div>

        {/* PASSWORD */}
        <div style={field}>
          <label style={label}>Password</label>
          <input
            type="text"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            style={input}
          />
        </div>

        {/* CLASS */}
        <div style={field}>
          <label style={label}>Class</label>
          <select
            name="classId"
            value={form.classId}
            onChange={handleChange}
            style={input}
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* BUTTON */}
        <button
          onClick={submitStudent}
          disabled={loading}
          style={{
            ...button,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Student"}
        </button>

        {/* ================= CREATED INFO BOX ================= */}
        {createdInfo && (
          <div style={infoBox}>
            <div style={infoRow}>
              <span>Student ID</span>
              <b>{createdInfo.studentId}</b>
            </div>
            <div style={infoRow}>
              <span>Password</span>
              <b>{createdInfo.password}</b>
            </div>

            <button onClick={copyCredentials} style={copyBtn}>
              Copy Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingTop: "60px",
};

const card = {
  width: "100%",
  maxWidth: "420px",
  background: "#0f172a",
  padding: "28px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
};

const title = {
  marginBottom: "20px",
  textAlign: "center",
  fontSize: "22px",
  fontWeight: "600",
};

const field = {
  marginBottom: "16px",
};

const label = {
  display: "block",
  marginBottom: "6px",
  fontSize: "14px",
  opacity: 0.85,
};

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#020617",
  color: "#fff",
  outline: "none",
};

const button = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontSize: "15px",
  fontWeight: "600",
};

/* INFO BOX */
const infoBox = {
  marginTop: "18px",
  padding: "14px",
  background: "#020617",
  border: "1px solid #334155",
  borderRadius: "10px",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "6px",
  fontSize: "14px",
};

const copyBtn = {
  marginTop: "10px",
  width: "100%",
  padding: "8px",
  background: "#22c55e",
  border: "none",
  borderRadius: "6px",
  color: "#022c22",
  fontWeight: "600",
  cursor: "pointer",
};
