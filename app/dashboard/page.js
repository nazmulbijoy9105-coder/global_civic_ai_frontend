"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getAssessmentHistory, getPaymentStatus } from "../../lib/api";

export default function DashboardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [history, setHistory] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    if (isAuthenticated) {
      Promise.all([
        getAssessmentHistory().catch(() => []),
        getPaymentStatus().catch(() => null),
      ]).then(([h, p]) => {
        setHistory(Array.isArray(h) ? h : []);
        setPaymentStatus(p);
        setLoading(false);
      });
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || loading) {
    return (<><Navbar /><div style={styles.container}><p style={{ color: "#64748B" }}>Loading...</p></div></>);
  }

  const completedSessions = history.filter((s) => s.status === "completed");
  const latestScore = completedSessions.length > 0 ? completedSessions[0].average_score : null;

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome back, <span style={styles.accent}>{user?.username}</span></h1>
          <p style={styles.subtitle}>Your civic awareness journey at a glance.</p>
        </div>
        <div style={styles.grid}>
          <div style={styles.card}><div style={styles.cardIcon}>📊</div><div style={styles.cardLabel}>Assessments</div><div style={styles.cardValue}>{history.length}</div></div>
          <div style={styles.card}><div style={styles.cardIcon}>🏆</div><div style={styles.cardLabel}>Latest Score</div><div style={styles.cardValue}>{latestScore !== null ? `${Math.round(latestScore * 100)}%` : "N/A"}</div></div>
          <div style={styles.card}><div style={styles.cardIcon}>💳</div><div style={styles.cardLabel}>Payment</div><div style={styles.cardValue}>{paymentStatus?.has_paid ? "Premium" : "Free"}</div></div>
          <div style={styles.card}><div style={styles.cardIcon}>🎯</div><div style={styles.cardLabel}>Completed</div><div style={styles.cardValue}>{completedSessions.length}</div></div>
        </div>
        <div style={styles.actions}>
          <a href="/assessment" style={styles.primaryBtn}>Start New Assessment</a>
          {!paymentStatus?.has_paid && <a href="/payment" style={styles.secondaryBtn}>Upgrade to Premium</a>}
        </div>
        {history.length > 0 && (
          <div style={styles.historySection}>
            <h2 style={styles.sectionTitle}>Assessment History</h2>
            <div style={styles.table}>
              <div style={styles.tableHeader}>
                <span style={styles.th}>Date</span><span style={styles.th}>Questions</span><span style={styles.th}>Score</span><span style={styles.th}>Status</span><span style={styles.th}>Action</span>
              </div>
              {history.map((s) => (
                <div key={s.session_id} style={styles.tableRow}>
                  <span style={styles.td}>{new Date(s.created_at).toLocaleDateString()}</span>
                  <span style={styles.td}>{s.current_index}/{s.total_questions}</span>
                  <span style={styles.td}>{s.status === "completed" ? `${Math.round(s.average_score * 100)}%` : "-"}</span>
                  <span style={styles.td}><span style={{ ...styles.statusBadge, background: s.status === "completed" ? "rgba(0,200,150,0.15)" : "rgba(234,179,8,0.15)", color: s.status === "completed" ? "#00C896" : "#EAB308" }}>{s.status}</span></span>
                  <span style={styles.td}>{s.status === "completed" ? <a href={`/report/${s.session_id}`} style={styles.viewBtn}>View Report</a> : <a href={`/assessment?session=${s.session_id}`} style={styles.viewBtn}>Continue</a>}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  container: { maxWidth: 1000, margin: "0 auto", padding: "40px 24px" },
  header: { marginBottom: 36 },
  title: { fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: "#0A1628", marginBottom: 8 },
  accent: { color: "#00C896" },
  subtitle: { color: "#64748B", fontSize: 15 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 32 },
  card: { background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)", textAlign: "center" },
  cardIcon: { fontSize: 32, marginBottom: 8 },
  cardLabel: { fontSize: 13, color: "#64748B", marginBottom: 4 },
  cardValue: { fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#0A1628" },
  actions: { display: "flex", gap: 16, marginBottom: 40, flexWrap: "wrap" },
  primaryBtn: { background: "linear-gradient(135deg, #00C896, #00A878)", color: "#fff", padding: "14px 28px", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none" },
  secondaryBtn: { background: "#fff", border: "2px solid #00C896", color: "#00C896", padding: "12px 28px", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none" },
  historySection: { marginTop: 20 },
  sectionTitle: { fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: "#0A1628", marginBottom: 16 },
  table: { background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" },
  tableHeader: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "14px 20px", background: "#0A1628" },
  th: { fontSize: 12, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" },
  tableRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "14px 20px", borderBottom: "1px solid #F1F5F9", alignItems: "center" },
  td: { fontSize: 14, color: "#374151" },
  statusBadge: { padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  viewBtn: { color: "#00C896", fontSize: 13, fontWeight: 600, textDecoration: "none" },
};

