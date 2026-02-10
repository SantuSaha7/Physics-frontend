"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // ends with /api

export default function MockTestPage() {
  const { mockID } = useParams();
  const router = useRouter();

  const [mock, setMock] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);

  /* ===============================
     LOAD MOCK + QUESTIONS (FIXED)
  =============================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // fetch all mocks (BASE already has /api)
        const mockRes = await fetch(`${API_BASE_URL}/mocks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const mockJson = await mockRes.json();
        const mocksArray = Array.isArray(mockJson)
          ? mockJson
          : mockJson.data || [];

        const foundMock = mocksArray.find((m) => m._id === mockID);

        if (!foundMock) {
          setLoading(false);
          return;
        }

        setMock(foundMock);
        setTimeLeft((foundMock.duration || 30) * 60);

        // fetch questions for this mock
        const qRes = await fetch(
          `${API_BASE_URL}/mocks/${mockID}/questions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const qData = await qRes.json();
        setQuestions(Array.isArray(qData) ? qData : qData.data || []);
      } catch (err) {
        console.error("Mock load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mockID]);

  /* ===============================
     TIMER
  =============================== */
  useEffect(() => {
    if (submitted || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, submitted]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted && questions.length > 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  /* ===============================
     ANSWER LOGIC (UNCHANGED)
  =============================== */
  const handleOptionClick = (index) => {
    if (!showResult) setSelectedOption(index);
  };

  const saveAnswerForCurrentQuestion = (optionIndex) => {
    const q = questions[currentIndex];
    if (!q) return;

    setAnswers((prev) => ({
      ...prev,
      [String(q._id)]: optionIndex,
    }));
  };

  const handleOk = () => {
    saveAnswerForCurrentQuestion(selectedOption);
    setShowResult(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    setCurrentIndex((i) => i + 1);
  };

  /* ===============================
     SUBMIT TEST (FIXED URL)
  =============================== */
  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);

    const q = questions[currentIndex];
    let finalAnswers = { ...answers };

    if (
      selectedOption !== null &&
      finalAnswers[String(q._id)] === undefined
    ) {
      finalAnswers[String(q._id)] = selectedOption;
    }

    const formattedAnswers = questions.map((question) => ({
      questionId: question._id,
      selectedIndex:
        finalAnswers[String(question._id)] !== undefined
          ? finalAnswers[String(question._id)]
          : null,
    }));

    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_BASE_URL}/results/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mockId: mock._id,
          answers: formattedAnswers,
        }),
      });

      router.push("/dashboard/results");
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading) return <p>Loading...</p>;
  if (!mock || questions.length === 0) return <p>No questions</p>;

  const q = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.timer}>⏱ {formatTime(timeLeft)}</div>

      <div style={styles.progressWrap}>
        <div style={{ ...styles.progressBar, width: `${progress}%` }} />
      </div>

      <p>
        Question {currentIndex + 1} / {questions.length}
      </p>

      <h2>{mock.title}</h2>
      <h3>{q.question}</h3>

      {q.options.map((opt, i) => {
        let bg = "#1f2937";
        if (showResult) {
          if (i === q.correctIndex) bg = "#16a34a";
          else if (i === selectedOption) bg = "#dc2626";
        } else if (i === selectedOption) bg = "#2563eb";

        return (
          <div
            key={i}
            onClick={() => handleOptionClick(i)}
            style={{ ...styles.option, background: bg }}
          >
            {opt}
          </div>
        );
      })}

      {!showResult && selectedOption !== null && (
        <button style={styles.btnPrimary} onClick={handleOk}>
          OK
        </button>
      )}

      {showResult && currentIndex < questions.length - 1 && (
        <button style={styles.btnSecondary} onClick={handleNext}>
          Next →
        </button>
      )}

      {showResult && currentIndex === questions.length - 1 && (
        <button style={styles.btnSubmit} onClick={handleSubmit}>
          Submit Test
        </button>
      )}
    </div>
  );
}

/* ===============================
   STYLES (UNCHANGED)
=============================== */
const styles = {
  container: {
    maxWidth: "700px",
    margin: "auto",
    padding: "20px",
    color: "#fff",
  },
  timer: {
    position: "fixed",
    top: "15px",
    right: "15px",
    background: "#020617",
    padding: "10px 16px",
    borderRadius: "10px",
    fontWeight: "bold",
    color: "#22c55e",
  },
  progressWrap: {
    height: "8px",
    background: "#1e293b",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "10px",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg,#2563eb,#22c55e)",
  },
  option: {
    padding: "14px",
    margin: "10px 0",
    borderRadius: "12px",
    cursor: "pointer",
  },
  btnPrimary: {
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "#fff",
  },
  btnSecondary: {
    width: "100%",
    padding: "14px",
    background: "#22c55e",
  },
  btnSubmit: {
    width: "100%",
    padding: "16px",
    background: "#dc2626",
    color: "#fff",
  },
};
