"use client";
import { useState } from "react";
import { loginUser, getCurrentUser } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!formData.username) e.username = "Username is required";
    if (!formData.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      const result = await loginUser(formData);
      if (result.access_token) {
        const userData = await getCurrentUser(result.access_token);
        login(result.access_token, userData);
        window.location.href = "/dashboard";
      } else {
        setServerError(result.detail || "Invalid username or password.");
      }
    } catch {
      setServerError("Could not connect to server. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { font-family: 'DM Sans', sans-serif; }
        input:focus { outline: none; border-color: #00C896 !important; box-shadow: 0 0 0 3px rgba(0,200,150,0.15); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,200,150,0.4) !important; }
        .link:hover { color: #00C896 !important; }
      `}</style>

      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.badge}>GLOBAL CIVIC AI</div>
          <h1 style={styles.headline}>
            Welcome<br />
            <span style={styles.accent}>Back.</span>
          </h1>
          <p style={styles.subtext}>
            Continue your civic awareness journey. Your progress, reports, and insights are waiting.
          </p>
          <div style={styles.features}>
            {[
              "🌍 120+ Civic & Financial Questions",
              "🤖 AI-Powered Personal Reports",
              "📊 Track Your Progress Over Time",
              "🔒 Secure & Private",
            ].map((f) => (
              <div key={f} style={styles.feature}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={styles.formTitle}>Sign In</h2>
            <p style={styles.formSub}>
              New here?{" "}
              <a href="/signup" className="link" style={{ color: "#0A1628", fontWeight: 600, textDecoration: "none" }}>
                Create an account →
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {[
              { name: "username", label: "Username", type: "text", placeholder: "Your username" },
              { name: "password", label: "Password", type: "password", placeholder: "Your password" },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name} style={styles.field}>
                <label style={styles.label}>{label}</label>
                <input
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(errors[name] ? styles.inputError : {}) }}
                />
                {errors[name] && <span style={styles.error}>{errors[name]}</span>}
              </div>
            ))}

            {serverError && (
              <div style={styles.serverError}>{serverError}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
              style={styles.submitBtn}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <a href="/forgot-password" className="link" style={{ fontSize: 13, color: "#94A3B8", textDecoration: "none" }}>
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#F8FAFC" },
  left: {
    flex: 1,
    background: "linear-gradient(135deg, #0A1628 0%, #0D2137 50%, #0A2E1F 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "60px 48px", position: "relative", overflow: "hidden",
  },
  leftContent: { position: "relative", zIndex: 1, animation: "fadeUp 0.8s ease" },
  badge: {
    display: "inline-block",
    background: "rgba(0,200,150,0.15)", border: "1px solid rgba(0,200,150,0.3)",
    color: "#00C896", padding: "6px 14px", borderRadius: 99,
    fontSize: 11, fontWeight: 700, letterSpacing: "2px", marginBottom: 32,
  },
  headline: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "clamp(48px, 5vw, 72px)", fontWeight: 800,
    color: "#F8FAFC", lineHeight: 1.05, marginBottom: 24, letterSpacing: "-1px",
  },
  accent: { color: "#00C896" },
  subtext: { color: "#94A3B8", fontSize: 16, lineHeight: 1.7, maxWidth: 380, marginBottom: 36 },
  features: { display: "flex", flexDirection: "column", gap: 12 },
  feature: { color: "#CBD5E1", fontSize: 14, display: "flex", alignItems: "center", gap: 8 },
  right: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" },
  card: {
    width: "100%", maxWidth: 420, background: "#fff",
    borderRadius: 20, padding: "48px 40px",
    boxShadow: "0 4px 40px rgba(0,0,0,0.08)", animation: "fadeUp 0.6s ease",
  },
  formTitle: { fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#0A1628", marginBottom: 6 },
  formSub: { fontSize: 14, color: "#64748B" },
  field: { marginBottom: 20 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
  input: {
    width: "100%", padding: "12px 16px", border: "1.5px solid #E2E8F0",
    borderRadius: 10, fontSize: 14, color: "#0A1628", background: "#F8FAFC", transition: "all 0.2s",
  },
  inputError: { borderColor: "#EF4444", background: "#FFF5F5" },
  error: { display: "block", fontSize: 12, color: "#EF4444", marginTop: 4 },
  serverError: {
    background: "#FFF5F5", border: "1px solid #FCA5A5",
    borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 16,
  },
  submitBtn: {
    width: "100%", padding: "14px",
    background: "linear-gradient(135deg, #00C896, #00A878)",
    color: "#fff", border: "none", borderRadius: 10,
    fontSize: 15, fontWeight: 700, cursor: "pointer",
    transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif", marginTop: 8,
  },
};
