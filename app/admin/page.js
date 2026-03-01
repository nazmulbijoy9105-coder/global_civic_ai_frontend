"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getAdminStats, getAdminUsers, getAdminSessions } from "../../lib/api";

export default function AdminPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    if (isAuthenticated) {
      Promise.all([
        getAdminStats().catch((e) => { setError("Access denied or failed to load"); return null; }),
        getAdminUsers().catch(() => []),
        getAdminSessions().catch(() => []),
      ]).then(([s, u, sess]) => {
        setStats(s);
        setUsers(Array.isArray(u) ? u : []);
        setSessions(Array.isArray(sess) ? sess : []);
        setLoading(false);
      });
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || loading) {
    return (<><Navbar /><div style={styles.container}><p style={{ color: "#64748B" }}>Loading admin panel...</p></div></>);
  }

  if (error) {
    return (<><Navbar /><div style={styles.container}><div style={styles.errorBanner}>{error}</div><a href="/dashboard" style={styles.link}>Back to Dashboard</a></div></>);
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>Admin Dashboard</h1>

        <div style={styles.tabs}>
          {["overview", "users", "sessions"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "overview" && stats && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard}><div style={styles.statValue}>{stats.total_users || 0}</div><div style={styles.statLabel}>Total Users</div></div>
            <div style={styles.statCard}><div style={styles.statValue}>{stats.total_sessions || 0}</div><div style={styles.statLabel}>Total Sessions</div></div>
            <div style={styles.statCard}><div style={styles.statValue}>{stats.total_responses || 0}</div><div style={styles.statLabel}>Total Responses</div></div>
            <div style={styles.statCard}><div style={styles.statValue}>{stats.total_questions || 0}</div><div style={styles.statLabel}>Questions in DB</div></div>
          </div>
        )}

        {tab === "users" && (
          <div style={styles.tableWrap}>
            <div style={styles.tableHeaderUsers}>
              <span style={styles.th}>ID</span><span style={styles.th}>Username</span><span style={styles.th}>Email</span><span style={styles.th}>Admin</span>
            </div>
            {users.map((u) => (
              <div key={u.id} style={styles.tableRowUsers}>
                <span style={styles.td}>{u.id}</span>
                <span style={styles.td}>{u.username}</span>
                <span style={styles.td}>{u.email}</span>
                <span style={styles.td}>{u.is_admin ? "Yes" : "No"}</span>
              </div>
            ))}
            {users.length === 0 && <div style={styles.empty}>No users found</div>}
          </div>
        )}

        {tab === "sessions" && (
          <div style={styles.tableWrap}>
            <div style={styles.tableHeaderSessions}>
              <span style={styles.th}>ID</span><span style={styles.th}>User ID</span><span style={styles.th}>Status</span><span style={styles.th}>Questions</span><span style={styles.th}>Date</span>
            </div>
            {sessions.map((s) => (
              <div key={s.id} style={styles.tableRowSessions}>
                <span style={styles.td}>{s.id}</span>
                <span style={styles.td}>{s.user_id}</span>
                <span style={styles.td}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600, background: s.status === "completed" ? "rgba(0,200,150,0.15)" : "rgba(234,179,8,0.15)", color: s.status === "completed" ? "#00C896" : "#EAB308" }}>{s.status}</span></span>
                <span style={styles.td}>{s.current_index}/{s.total_questions}</span>
                <span style={styles.td}>{new Date(s.created_at).toLocaleDateString()}</span>
              </div>
            ))}
            {sessions.length === 0 && <div style={styles.empty}>No sessions found</div>}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  container: { maxWidth: 1000, margin: "0 auto", padding: "40px 24px" },
  title: { fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: "#0A1628", marginBottom: 24 },
  errorBanner: { background: "#FFF5F5", border: "1px solid #FCA5A5", borderRadius: 12, padding: "16px 20px", color: "#DC2626", marginBottom: 16 },
  link: { color: "#00C896", textDecoration: "none", fontWeight: 600 },
  tabs: { display: "flex", gap: 8, marginBottom: 24 },
  tab: { padding: "10px 20px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff", color: "#64748B", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  tabActive: { background: "#0A1628", color: "#F8FAFC", borderColor: "#0A1628" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 },
  statCard: { background: "#fff", borderRadius: 16, padding: "24px", textAlign: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" },
  statValue: { fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: "#0A1628" },
  statLabel: { fontSize: 13, color: "#64748B", marginTop: 4 },
  tableWrap: { background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" },
    tableHeaderUsers: { display: "grid", gridTemplateColumns: "60px 1fr 1fr 80px", padding: "14px 20px", background: "#0A1628" },
    tableRowUsers: { display: "grid", gridTemplateColumns: "60px 1fr 1fr 80px", padding: "14px 20px", borderBottom: "1px solid #F1F5F9", alignItems: "center" },
    tableHeaderSessions: { display: "grid", gridTemplateColumns: "60px 80px 100px 100px 1fr", padding: "14px 20px", background: "#0A1628" },
    tableRowSessions: { display: "grid", gridTemplateColumns: "60px 80px 100px 100px 1fr", padding: "14px 20px", borderBottom: "1px solid #F1F5F9", alignItems: "center" },
  th: { fontSize: 12, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase" },
  td: { fontSize: 14, color: "#374151" },
  empty: { padding: "24px", textAlign: "center", color: "#64748B" },
};
