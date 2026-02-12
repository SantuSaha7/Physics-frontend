"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function FeesPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("panel_token")
      : null;

  /* LOAD CLASSES */
  useEffect(() => {
    if (!token || !API_BASE_URL) return;

    const fetchClasses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();
        setClasses(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchClasses();
  }, [token]);

  /* LOAD FEES */
  useEffect(() => {
    if (!selectedClass || !token || !API_BASE_URL) return;

    const fetchFees = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${API_BASE_URL}/fees/class/${selectedClass}?year=${year}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          setFees([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setFees(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchFees();
  }, [selectedClass, year, token]);

  /* TOGGLE */
  const toggleMonth = (studentIndex, monthIndex) => {
    const updated = [...fees];
    const month = updated[studentIndex].months[monthIndex];

    month.paid = !month.paid;
    month.paidAt = month.paid ? new Date() : null;

    setFees(updated);
  };

  /* SAVE */
  const saveStudent = async (studentId, months) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/fees/student/${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ year, months }),
        }
      );

      if (!res.ok) {
        alert("Save Failed");
        return;
      }

      alert("Saved Successfully");
    } catch (err) {
      console.error(err);
      alert("Save Failed");
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "auto" }}>
      <h2 style={{ marginBottom: 20 }}>💰 Fees Management</h2>

      {/* FILTERS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={inputStyle}
        />
      </div>

      {loading && <p>Loading...</p>}

      {/* STUDENT CARDS */}
      {fees.map((studentFee, i) => (
        <div key={studentFee._id} style={cardStyle}>
          <h3 style={{ marginBottom: 15 }}>
            👨‍🎓 {studentFee.studentId?.username || "Unnamed Student"}
          </h3>

          <div style={monthGrid}>
            {studentFee.months?.map((m, j) => (
              <div key={j} style={monthBox}>
                <label style={{ fontSize: 11 }}>
                  <input
                    type="checkbox"
                    checked={m.paid}
                    onChange={() => toggleMonth(i, j)}
                  />
                  <br />
                  {monthNames[m.month - 1]}
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={() =>
              saveStudent(studentFee.studentId?._id, studentFee.months)
            }
            style={saveBtn}
          >
            Save
          </button>
        </div>
      ))}
    </div>
  );
}

/* STYLES */

const inputStyle = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #1e293b",
  background: "#020617",
  color: "#fff",
};

const cardStyle = {
  background: "#0f172a",
  padding: 20,
  borderRadius: 12,
  marginBottom: 25,
  border: "1px solid #1e293b",
};

const monthGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))",
  gap: 10,
  marginBottom: 15,
};

const monthBox = {
  background: "#1e293b",
  padding: 10,
  borderRadius: 8,
  textAlign: "center",
};

const saveBtn = {
  padding: "8px 16px",
  borderRadius: 8,
  background: "#22c55e",
  color: "#000",
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
};
