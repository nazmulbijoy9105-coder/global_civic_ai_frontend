"use client";
import Navbar from "./components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>AI-POWERED CIVIC AWARENESS</div>
          <h1 style={styles.title}>
            Know Your <span style={styles.accent}>Rights.</span>
            <br />
            Shape Your <span style={styles.accent}>Future.</span>
          </h1>
          <p style={styles.subtitle}>
            120+ civic and financial awareness questions across 5 languages.
            Get AI-powered insights, personalized reports, and track your
            progress over time.
          </p>
          <div style={styles.buttons}>
            {isAuthenticated ? (
              <a href="/dashboard" style={styles.primaryBtn}>Go to Dashboard</a>
            ) : (
              <>
                <a href="/signup" style={styles.primaryBtn}>Get Started Free</a>
                <a href="/login" style={styles.secondaryBtn}>Sign In</a>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={styles.features}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.featureGrid}>
          {[
            { icon: "📝", title: "Take Assessment", desc: "Answer 20 curated questions about civic rights, financial literacy, and social awareness." },
            { icon: "🤖", title: "AI Analysis", desc: "Our AI engine analyzes your responses with psychometric scoring and ethical multipliers." },
            { icon: "📊", title: "Get Your Report", desc: "Receive a detailed report with scores, recommendations, and downloadable PDF." },
            { icon: "🌍", title: "5 Languages", desc: "Available in English, Bengali, Hindi, Japanese, and Chinese for global accessibility." },
          ].map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.statsSection}>
        {[["120+", "Civic Questions"], ["5", "Languages"], ["AI", "Powered Reports"], ["PDF", "Downloadable"]].map(([num, label]) => (
          <div key={label} style={styles.statItem}>
            <div style={styles.statNum}>{num}</div>
            <div style={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <footer style={styles.footer}>
        <p style={styles.footerText}>Global Civic AI - Empowering citizens worldwide with AI-driven civic awareness.</p>
      </footer>
    </>
  );
}

const styles = {
  hero: { background: "linear-gradient(135deg, #0A1628 0%, #0D2137 50%, #0A2E1F 100%)", padding: "100px 24px 80px", textAlign: "center" },
  heroContent: { maxWidth: 720, margin: "0 auto" },
  badge: { display: "inline-block", background: "rgba(0,200,150,0.15)", border: "1px solid rgba(0,200,150,0.3)", color: "#00C896", padding: "6px 16px", borderRadius: 99, fontSize: 11, fontWeight: 700, letterSpacing: "2px", marginBottom: 28 },
  title: { fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, color: "#F8FAFC", lineHeight: 1.1, marginBottom: 24, letterSpacing: "-1px" },
  accent: { color: "#00C896" },
  subtitle: { color: "#94A3B8", fontSize: 17, lineHeight: 1.7, maxWidth: 540, margin: "0 auto 36px" },
  buttons: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" },
  primaryBtn: { background: "linear-gradient(135deg, #00C896, #00A878)", color: "#fff", padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none" },
  secondaryBtn: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#F8FAFC", padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none" },
  features: { padding: "80px 24px", background: "#F8FAFC", textAlign: "center" },
  sectionTitle: { fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: "#0A1628", marginBottom: 48 },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" },
  featureCard: { background: "#fff", borderRadius: 16, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)", textAlign: "center" },
  featureIcon: { fontSize: 40, marginBottom: 16 },
  featureTitle: { fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#0A1628", marginBottom: 8 },
  featureDesc: { color: "#64748B", fontSize: 14, lineHeight: 1.6 },
  statsSection: { display: "flex", justifyContent: "center", gap: 48, padding: "60px 24px", background: "#0A1628", flexWrap: "wrap" },
  statItem: { textAlign: "center" },
  statNum: { fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: "#00C896" },
  statLabel: { color: "#94A3B8", fontSize: 13, marginTop: 4 },
  footer: { background: "#0A1628", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px", textAlign: "center" },
  footerText: { color: "#64748B", fontSize: 13 },
};
