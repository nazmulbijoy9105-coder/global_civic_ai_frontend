"use client";
import { useState, useEffect, use } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../../context/AuthContext";
import { getSessionReport, getReportPdfUrl } from "../../../lib/api";

export default function ReportPage({ params }) {
  const resolvedParams = use(params);
  const sessionId = resolvedParams.id;
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    if (isAuthenticated && sessionId) {
      getSessionReport(sessionId)
        .then((r) => { setReport(r); setLoading(false); })
        .catch(() => { setError("Failed to load report"); setLoading(false); });
    }
  }, [authLoading, isAuthenticated, sessionId]);

  if (authLoading || loading) {
    return (<><Navbar /><div style={styles.container}><p style={{ color: "#64748B" }}>Loading report...</p></div></>);
  }

  if (error || !report) {
    return (<><Navbar /><div style={styles.container}><p style={{ color: "#EF4444" }}>{error || "Report not found"}</p><a href="/dashboard" style={styles.link}>Back to Dashboard</a></div></>);
  }

  const scoreEntries = report.scores ? Object.entries(report.scores) : [];

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Assessment Report</h1>
          <p style={styles.subtitle}>Session #{sessionId} - {report.completed_at ? new Date(report.completed_at).toLocaleDateString() : "In Progress"}</p>
        </div>

        <div style={styles.overallCard}>
          <div style={styles.overallScore}>{Math.round((report.total_score || 0) * 100)}%</div>
          <div style={styles.overallLabel}>Overall Score</div>
          <p style={styles.summary}>{report.summary}</p>
        </div>

        {scoreEntries.length > 0 && (
          <div style={styles.scoresSection}>
            <h2 style={styles.sectionTitle}>Score Breakdown</h2>
            <div style={styles.scoreGrid}>
              {scoreEntries.map(([trait, data]) => (
                <div key={trait} style={styles.scoreCard}>
                  <div style={styles.traitName}>{trait.replace(/_/g, " ")}</div>
                  <div style={styles.scoreBar}>
                    <div style={{ ...styles.scoreFill, width: `${Math.round((data.score || 0) * 100)}%` }} />
                  </div>
                  <div style={styles.scoreDetails}>
                    <span>Score: {Math.round((data.score || 0) * 100)}%</span>
                    <span>Confidence: {Math.round((data.confidence || 0) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {report.recommendations && report.recommendations.length > 0 && (
          <div style={styles.recsSection}>
            <h2 style={styles.sectionTitle}>Recommendations</h2>
            <div style={styles.recsList}>
              {report.recommendations.map((rec, i) => (
                <div key={i} style={styles.recItem}>
                  <span style={styles.recIcon}>💡</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={styles.actions}>
          <a href="/dashboard" style={styles.secondaryBtn}>Back to Dashboard</a>
          <a href="/assessment" style={styles.primaryBtn}>Take Another Assessment</a>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: { maxWidth: 800, margin: "0 auto", padding: "40px 24px" },
  header: { marginBottom: 32 },
  title: { fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: "#0A1628", marginBottom: 8 },
  subtitle: { color: "#64748B", fontSize: 15 },
  link: { color: "#00C896", textDecoration: "none", fontWeight: 600 },
  overallCard: { background: "linear-gradient(135deg, #0A1628 0%, #0A2E1F 100%)", borderRadius: 20, padding: "40px", textAlign: "center", marginBottom: 32 },
  overallScore: { fontFamily: "'Syne', sans-serif", fontSize: 64, fontWeight: 800, color: "#00C896" },
  overallLabel: { fontSize: 14, color: "#94A3B8", marginBottom: 16 },
  summary: { color: "#CBD5E1", fontSize: 15, lineHeight: 1.7, maxWidth: 500, margin: "0 auto" },
  scoresSection: { marginBottom: 32 },
  sectionTitle: { fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: "#0A1628", marginBottom: 16 },
  scoreGrid: { display: "flex", flexDirection: "column", gap: 12 },
  scoreCard: { background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" },
  traitName: { fontSize: 15, fontWeight: 600, color: "#0A1628", marginBottom: 10, textTransform: "capitalize" },
  scoreBar: { height: 8, background: "#E2E8F0", borderRadius: 4, overflow: "hidden", marginBottom: 8 },
  scoreFill: { height: "100%", background: "linear-gradient(90deg, #00C896, #00A878)", borderRadius: 4, transition: "width 0.5s ease" },
  scoreDetails: { display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748B" },
  recsSection: { marginBottom: 32 },
  recsList: { display: "flex", flexDirection: "column", gap: 10 },
  recItem: { background: "#fff", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "#374151", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" },
  recIcon: { fontSize: 20 },
  actions: { display: "flex", gap: 16, justifyContent: "center", marginTop: 32 },
  primaryBtn: { background: "linear-gradient(135deg, #00C896, #00A878)", color: "#fff", padding: "14px 28px", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none" },
  secondaryBtn: { background: "#fff", border: "2px solid #E2E8F0", color: "#374151", padding: "12px 28px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none" },
};
