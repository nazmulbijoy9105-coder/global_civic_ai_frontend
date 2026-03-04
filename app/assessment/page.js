"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { startAssessment, getSessionQuestions, submitAnswer, completeSession } from "../../lib/api";

const SCORE_MAP = { Always: 4, Sometimes: 3, Rarely: 2, Never: 1 };

export default function AssessmentPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [authLoading, isAuthenticated]);

  const handleStart = async () => {
    setStarting(true);
    try {
      const s = await startAssessment(20);
      if (s.id) {
        setSession(s);
        const qs = await getSessionQuestions(s.id);
        if (Array.isArray(qs)) {
          setQuestions(qs);
          setCurrentIndex(s.current_index || 0);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setStarting(false);
  };

  const handleAnswer = async (answer) => {
    if (loading) return;
    setSelectedAnswer(answer);
    setLoading(true);
    const score = SCORE_MAP[answer] || 2;
    const q = questions[currentIndex];

    try {
      await submitAnswer(session.id, q.id, answer, score);
      if (currentIndex + 1 >= questions.length) {
        const result = await completeSession(session.id);
        setCompleted(true);
        setReport(result);
      } else {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (authLoading) {
    return (<><Navbar /><div style={styles.container}><p>Loading...</p></div></>);
  }

  if (completed && report) {
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.completedCard}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h1 style={styles.title}>Assessment Complete!</h1>
            <p style={styles.subtitle}>You answered {questions.length} questions.</p>
            <div style={styles.actions}>
              <a href={`/report/${session.id}`} style={styles.primaryBtn}>View Full Report</a>
              <a href="/dashboard" style={styles.secondaryBtn}>Back to Dashboard</a>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.startCard}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
            <h1 style={styles.title}>Civic Awareness Assessment</h1>
            <p style={styles.subtitle}>Answer 20 questions about civic rights, financial literacy, and social awareness. The AI engine will analyze your responses and generate a personalized report.</p>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}><strong>📋 20</strong> Questions</div>
              <div style={styles.infoItem}><strong>⏱ 10-15</strong> Minutes</div>
              <div style={styles.infoItem}><strong>🤖 AI</strong> Analysis</div>
              <div style={styles.infoItem}><strong>📄 PDF</strong> Report</div>
            </div>
            <button onClick={handleStart} disabled={starting} style={styles.primaryBtn}>
              {starting ? "Starting..." : "Start Assessment"}
            </button>
          </div>
        </div>
      </>
    );
  }

  const q = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;
  const options = q?.options ? q.options.split(",") : ["Always", "Sometimes", "Rarely", "Never"];

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <div style={styles.progressText}>Question {currentIndex + 1} of {questions.length}</div>

        <div style={styles.questionCard}>
          <div style={styles.category}>{q?.category || "General"}</div>
          <h2 style={styles.questionText}>{q?.text_en || "Loading..."}</h2>

          <div style={styles.options}>
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt.trim())}
                disabled={loading}
                style={{
                  ...styles.optionBtn,
                  ...(selectedAnswer === opt.trim() ? styles.optionSelected : {}),
                }}
              >
                {opt.trim()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: { maxWidth: 700, margin: "0 auto", padding: "40px 24px" },
  startCard: { background: "#fff", borderRadius: 20, padding: "48px 40px", boxShadow: "0 4px 40px rgba(0,0,0,0.08)", textAlign: "center" },
  completedCard: { background: "#fff", borderRadius: 20, padding: "48px 40px", boxShadow: "0 4px 40px rgba(0,0,0,0.08)", textAlign: "center" },
  title: { fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#0A1628", marginBottom: 12 },
  subtitle: { color: "#64748B", fontSize: 15, lineHeight: 1.7, marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 },
  infoItem: { background: "#F8FAFC", borderRadius: 10, padding: "12px 8px", fontSize: 13, color: "#374151" },
  primaryBtn: { display: "inline-block", background: "linear-gradient(135deg, #00C896, #00A878)", color: "#fff", padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  secondaryBtn: { display: "inline-block", background: "#fff", border: "2px solid #00C896", color: "#00C896", padding: "12px 32px", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none", marginLeft: 12 },
  actions: { display: "flex", gap: 16, justifyContent: "center", marginTop: 24 },
  progressBar: { height: 6, background: "#E2E8F0", borderRadius: 3, marginBottom: 8, overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #00C896, #00A878)", borderRadius: 3, transition: "width 0.3s ease" },
  progressText: { fontSize: 13, color: "#64748B", marginBottom: 24, textAlign: "center" },
  questionCard: { background: "#fff", borderRadius: 20, padding: "40px", boxShadow: "0 4px 40px rgba(0,0,0,0.08)" },
  category: { display: "inline-block", background: "rgba(0,200,150,0.12)", color: "#00C896", padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, marginBottom: 16, textTransform: "capitalize" },
  questionText: { fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: "#0A1628", lineHeight: 1.4, marginBottom: 32 },
  options: { display: "flex", flexDirection: "column", gap: 12 },
  optionBtn: { width: "100%", padding: "16px 20px", background: "#F8FAFC", border: "2px solid #E2E8F0", borderRadius: 12, fontSize: 15, fontWeight: 500, color: "#374151", cursor: "pointer", textAlign: "left", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" },
  optionSelected: { background: "rgba(0,200,150,0.1)", borderColor: "#00C896", color: "#00C896" },
};
