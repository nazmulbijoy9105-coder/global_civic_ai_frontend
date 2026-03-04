"use client";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav style={styles.nav}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .nav-link { color: #94A3B8; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: #00C896; }
        .nav-link.active { color: #00C896; }
        .logout-btn:hover { background: rgba(239,68,68,0.15) !important; color: #EF4444 !important; }
      `}</style>
      <div style={styles.container}>
        <a href="/" style={styles.logo}>
          <span style={styles.logoIcon}>🌍</span>
          <span style={styles.logoText}>Global Civic AI</span>
        </a>

        <div style={styles.links}>
          {isAuthenticated ? (
            <>
              <a href="/dashboard" className="nav-link">Dashboard</a>
              <a href="/assessment" className="nav-link">Assessment</a>
              <a href="/profile" className="nav-link">Profile</a>
              {user?.is_admin && <a href="/admin" className="nav-link">Admin</a>}
              <button onClick={logout} className="logout-btn" style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="nav-link">Sign In</a>
              <a href="/signup" style={styles.signupBtn}>Get Started</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#0A1628",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    padding: "0 24px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
  },
  logoIcon: { fontSize: 24 },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 18,
    fontWeight: 800,
    color: "#F8FAFC",
    letterSpacing: "-0.5px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: 24,
  },
  logoutBtn: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#94A3B8",
    padding: "6px 16px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'DM Sans', sans-serif",
  },
  signupBtn: {
    background: "linear-gradient(135deg, #00C896, #00A878)",
    color: "#fff",
    padding: "8px 20px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.2s",
  },
};
