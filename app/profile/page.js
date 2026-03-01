"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getPaymentStatus, getAssessmentHistory } from "../../lib/api";

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ assessments: 0, completed: 0, hasPaid: false });
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
        const hist = Array.isArray(h) ? h : [];
        setStats({
          assessments: hist.length,
          completed: hist.filter((s) => s.status === "completed").length,
          hasPaid: p?.has_paid || false,
        });
        setLoading(false);
      });
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || loading) {
    return (<><Navbar /><div style={styles.container}><p style={{ color: "#64748B" }}>Loading...</p></div></>);
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.profileCard}>
          <div style={styles.avatar}>{user?.username?.charAt(0)?.toUpperCase() || "U"}</div>
          <h1 style={styles.name}>{user?.username}</h1>
          <p style={styles.email}>{user?.email}</p>
          <span style={{ ...styles.badge, background: stats.hasPaid ? "rgba(0,200,150,0.15)" : "rgba(234,179,8,0.15)", color: stats.hasPaid ? "#00C896" : "#EAB308" }}>
            {stats.hasPaid ? "Premium" : "Free Plan"}
          </span>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}><div style={styles.statValue}>{stats.assessments}</div><div style={styles.statLabel}>Total Assessments</div></div>
          <div style={styles.statCard}><div style={styles.statValue}>{stats.completed}</div><div style={styles.statLabel}>Completed</div></div>
          <div style={styles.statCard}><div style={styles.statValue}>{user?.id || "-"}</div><div style={styles.statLabel}>User ID</div></div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Account Details</h2>
          <div style={styles.detailRow}><span style={styles.detailLabel}>Username</span><span style={styles.detailValue}>{user?.username}</span></div>
          <div style={styles.detailRow}><span style={styles.detailLabel}>Email</span><span style={styles.detailValue}>{user?.email}</span></div>
          <div style={styles.detailRow}><span style={styles.detailLabel}>Plan</span><span style={styles.detailValue}>{stats.hasPaid ? "Premium" : "Free"}</span></div>
          <div style={styles.detailRow}><span style={styles.detailLabel}>Role</span><span style={styles.detailValue}>{user?.is_admin ? "Admin" : "User"}</span></div>
        </div>

        <div style={styles.actions}>
          {!stats.hasPaid && <a href="/payment" style={styles.primaryBtn}>Upgrade to Premium</a>}
          <a href="/dashboard" style={styles.secondaryBtn}>Back to Dashboard</a>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: { maxWidth: 700, margin: "0 auto", padding: "40px 24px" },
  profileCard: { background: "linear-gradient(135deg, #0A1628 0%, #0A2E1F 100%)", borderRadius: 20, padding: "40px", textAlign: "center", marginBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #00C896, #00A878)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "#fff", margin: "0 auto 16px", fontFamily: "'Syne', sans-serif" },
  name: { fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#F8FAFC", marginBottom: 4 },
  email: { color: "#94A3B8", fontSize: 14, marginBottom: 12 },
  badge: { display: "inline-block", padding: "4px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 },
  statCard: { background: "#fff", borderRadius: 16, padding: "24px", textAlign: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" },
  statValue: { fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#0A1628" },
  statLabel: { fontSize: 13, color: "#64748B", marginTop: 4 },
  section: { background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)", marginBottom: 24 },
  sectionTitle: { fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#0A1628", marginBottom: 16 },
  detailRow: { display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #F1F5F9" },
  detailLabel: { fontSize: 14, color: "#64748B" },
  detailValue: { fontSize: 14, fontWeight: 600, color: "#0A1628" },
  actions: { display: "flex", gap: 16, justifyContent: "center", marginTop: 24 },
  primaryBtn: { background: "linear-gradient(135deg, #00C896, #00A878)", color: "#fff", padding: "14px 28px", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none" },
  secondaryBtn: { background: "#fff", border: "2px solid #E2E8F0", color: "#374151", padding: "12px 28px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none" },
};

