"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export default function MocksPage() {
  const [classes, setClasses] = useState([]);
  const [mocks, setMocks] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMock, setSelectedMock] = useState(null);

  const [mockForm, setMockForm] = useState({
    title: "",
    class_id: "",
    duration: ""
  });

  const [questionForm, setQuestionForm] = useState({
    mock_test_id: "",
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0
  });

  /* ================= LOAD DATA ================= */
  const loadMocks = async () => {
    const res = await api.get("/mocks/panel");
    if (Array.isArray(res)) setMocks(res);
  };

  useEffect(() => {
    const loadClasses = async () => {
      const res = await api.get("/classes");
      if (Array.isArray(res)) setClasses(res);
    };

    loadClasses();
    loadMocks();
  }, []);

  /* ================= CREATE MOCK ================= */
  const createMock = async () => {
    if (!mockForm.title || !mockForm.class_id || !mockForm.duration) {
      alert("All mock fields required");
      return;
    }

    await api.post("/mocks/panel/create", mockForm);
    alert("Mock test created");

    setMockForm({ title: "", class_id: "", duration: "" });
    loadMocks();
  };

  /* ================= DELETE MOCK ================= */
  const deleteMock = async (mockId) => {
    if (!confirm("Delete this mock test?")) return;
    await api.delete(`/mocks/panel/${mockId}`);
    setSelectedMock(null);
    loadMocks();
  };

  /* ================= ADD QUESTION ================= */
  const addQuestion = async () => {
    const { mock_test_id, question, options } = questionForm;

    if (!mock_test_id || !question || options.some(o => !o)) {
      alert("Fill all question fields");
      return;
    }

    await api.post("/mocks/panel/add-question", {
      ...questionForm,
      correctIndex: Number(questionForm.correctIndex)
    });

    alert("Question added");

    setQuestionForm({
      ...questionForm,
      question: "",
      options: ["", "", "", ""]
    });

    if (selectedMock?.mock?._id === mock_test_id) {
      viewQuestions(mock_test_id);
    }
  };

  /* ================= VIEW QUESTIONS ================= */
  const viewQuestions = async (mockId) => {
    const res = await api.get(`/mocks/panel/${mockId}/details`);
    setSelectedMock({ mock: res.mock, questions: res.questions || [] });
  };

  /* ================= DELETE QUESTION ================= */
  const deleteQuestion = async (questionId, mockId) => {
    if (!confirm("Delete this question?")) return;
    await api.delete(`/mocks/panel/question/${questionId}`);
    viewQuestions(mockId);
  };

  const filteredMocks = selectedClass
    ? mocks.filter(m => m.class_id === selectedClass)
    : [];

  return (
    <div style={page}>
      <h1 style={{ marginBottom: 36 }}>Mock Test Panel</h1>

      {/* CREATE MOCK */}
      <section style={card}>
        <h3 style={sectionTitle}>Create Mock Test</h3>

        <div style={grid}>
          <input
            style={input}
            placeholder="Mock Title"
            value={mockForm.title}
            onChange={e => setMockForm({ ...mockForm, title: e.target.value })}
          />

          <select
            style={input}
            value={mockForm.class_id}
            onChange={e => setMockForm({ ...mockForm, class_id: e.target.value })}
          >
            <option value="">Select Class</option>
            {classes.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <input
            style={input}
            type="number"
            placeholder="Duration (minutes)"
            value={mockForm.duration}
            onChange={e => setMockForm({ ...mockForm, duration: e.target.value })}
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <button style={primaryBtn} onClick={createMock}>
            Create Mock
          </button>
        </div>
      </section>

      {/* MANAGE MOCKS */}
      <section style={card}>
        <h3 style={sectionTitle}>Manage Mocks</h3>

        <select
          style={{ ...input, marginBottom: 28 }}
          value={selectedClass}
          onChange={e => {
            setSelectedClass(e.target.value);
            setSelectedMock(null);
          }}
        >
          <option value="">Select Class</option>
          {classes.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        {filteredMocks.map(m => (
          <div key={m._id} style={mockItem}>
            <strong>{m.title}</strong>

            <div style={{ marginTop: 14 }}>
              <button style={secondaryBtn} onClick={() => viewQuestions(m._id)}>
                View Questions
              </button>
              <button style={dangerBtn} onClick={() => deleteMock(m._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ADD QUESTION */}
      <section style={card}>
        <h3 style={sectionTitle}>Add Question</h3>

        <div style={formGroup}>
          <select
            style={input}
            value={questionForm.mock_test_id}
            onChange={e =>
              setQuestionForm({ ...questionForm, mock_test_id: e.target.value })
            }
          >
            <option value="">Select Mock Test</option>
            {mocks.map(m => (
              <option key={m._id} value={m._id}>{m.title}</option>
            ))}
          </select>

          <textarea
            style={{ ...input, minHeight: 110 }}
            placeholder="Question text"
            value={questionForm.question}
            onChange={e =>
              setQuestionForm({ ...questionForm, question: e.target.value })
            }
          />
        </div>

        <div style={optionBox}>
          <h4>Options</h4>

          {questionForm.options.map((opt, idx) => (
            <input
              key={idx}
              style={input}
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={e => {
                const newOptions = [...questionForm.options];
                newOptions[idx] = e.target.value;
                setQuestionForm({ ...questionForm, options: newOptions });
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <select
            style={input}
            value={questionForm.correctIndex}
            onChange={e =>
              setQuestionForm({
                ...questionForm,
                correctIndex: Number(e.target.value)
              })
            }
          >
            <option value={0}>Correct Option 1</option>
            <option value={1}>Correct Option 2</option>
            <option value={2}>Correct Option 3</option>
            <option value={3}>Correct Option 4</option>
          </select>
        </div>

        <button style={{ ...primaryBtn, marginTop: 28 }} onClick={addQuestion}>
          Add Question
        </button>
      </section>

      {/* VIEW QUESTIONS */}
      {selectedMock?.mock && (
        <section style={card}>
          <h3 style={sectionTitle}>
            Questions: {selectedMock.mock.title}
          </h3>

          {selectedMock.questions.map((q, i) => (
            <div key={q._id} style={questionRow}>
              <span><b>Q{i + 1}.</b> {q.question}</span>
              <button
                style={dangerBtn}
                onClick={() =>
                  deleteQuestion(q._id, selectedMock.mock._id)
                }
              >
                Delete
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "36px"
};

const card = {
  background: "#0b1220",
  color: "#fff",
  padding: 28,
  borderRadius: 16,
  marginBottom: 40,
  border: "1px solid #1e293b"
};

const sectionTitle = {
  marginBottom: 22,
  paddingBottom: 12,
  borderBottom: "1px solid #1e293b"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 18
};

const input = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #334155",
  background: "#020617",
  color: "#fff"
};

const mockItem = {
  padding: "16px 0",
  borderBottom: "1px solid #1e293b"
};

const questionRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 0",
  borderBottom: "1px solid #1e293b"
};

const primaryBtn = {
  padding: "12px 22px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer"
};

const secondaryBtn = {
  padding: "8px 14px",
  background: "#334155",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  marginRight: 10,
  cursor: "pointer"
};

const dangerBtn = {
  padding: "8px 14px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer"
};

const formGroup = {
  display: "flex",
  flexDirection: "column",
  gap: 18
};

const optionBox = {
  marginTop: 24,
  padding: 20,
  border: "1px solid #334155",
  borderRadius: 14,
  background: "#020617",
  display: "flex",
  flexDirection: "column",
  gap: 16
};
