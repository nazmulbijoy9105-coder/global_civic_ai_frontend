"use client";
import { useState } from "react";
import { registerUser, loginUser, getCurrentUser } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function SignupPage() {
  const { login } = useAuth();
  const [step, setStep] = useState(1); // 1=form, 2=success
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!formData.username || formData.username.length < 3) e.username = "Min 3 characters";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) e.email = "Valid email required";
    if (!formData.password || formData.password.length < 6) e.password = "Min 6 characters";
    if (formData.password !== formData.confirm) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      const result = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      if (result.id) {
        // Auto-login after signup
        const loginResult = await loginUser({ username: formData.username, password: formData.password });
        if (loginResult.access_token) {
          const userData = await getCurrentUser(loginResult.access_token);
          login(loginResult.access_token, userData);
          setStep(2);
          setTimeout(() => window.location.href = "/dashboard", 2000);
        }
      } else {
        setServerError(result.detail || "Registration failed. Try a different username or email.");
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
        @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,200,150,0.4) !important; }
        .submit-btn:active { transform: translateY(0); }
        .link:hover { color: #00C896 !important; }
      `}</style>

      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.badge}>GLOBAL CIVIC AI</div>
          <h1 style={styles.headline}>
            Know Your<br />
            <span style={styles.accent}>Rights.</span><br />
            Shape Your<br />
            <span style={styles.accent}>Future.</span>
          </h1>
          <p style={styles.subtext}>
            120+ civic & financial awareness questions. AI-powered insights. Built for citizens worldwide.
          </p>
          <div style={styles.stats}>
            {[["120+", "Civic Questions"], ["15+", "Countries"], ["AI", "Powered Reports"]].map(([n, l]) => (
              <div key={l} style={styles.stat}>
                <span style={styles.statNum}>{n}</span>
                <span style={styles.statLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          {step === 2 ? (
            <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#0A1628", marginBottom: 8 }}>
                Welcome aboard!
              </h2>
              <p style={{ color: "#64748B" }}>Redirecting to your dashboard...</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 32 }}>
                <h2 style={styles.formTitle}>Create Account</h2>
                <p style={styles.formSub}>
                  Already have one?{" "}
                  <a href="/login" className="link" style={{ color: "#0A1628", fontWeight: 600, textDecoration: "none" }}>
                    Sign in →
                  </a>
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {[
                  { name: "username", label: "Username", type: "text", placeholder: "e.g. civic_hero" },
                  { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                  { name: "password", label: "Password", type: "password", placeholder: "Min 6 characters" },
                  { name: "confirm", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
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
                  {loading ? "Creating account..." : "Create Account →"}
                </button>
              </form>

              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 20, textAlign: "center", lineHeight: 1.6 }}>
                By signing up you agree to our Terms of Service and Privacy Policy.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif",
    background: "#F8FAFC",
  },
  left: {
    flex: 1,
    background: "linear-gradient(135deg, #0A1628 0%, #0D2137 50%, #0A2E1F 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 48px",
    position: "relative",
    overflow: "hidden",
  },
  leftContent: {
    position: "relative",
    zIndex: 1,
    animation: "fadeUp 0.8s ease",
  },
  badge: {
    display: "inline-block",
    background: "rgba(0,200,150,0.15)",
    border: "1px solid rgba(0,200,150,0.3)",
    color: "#00C896",
    padding: "6px 14px",
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "2px",
    marginBottom: 32,
  },
  headline: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "clamp(40px, 5vw, 64px)",
    fontWeight: 800,
    color: "#F8FAFC",
    lineHeight: 1.1,
    marginBottom: 24,
    letterSpacing: "-1px",
  },
  accent: {
    color: "#00C896",
  },
  subtext: {
    color: "#94A3B8",
    fontSize: 16,
    lineHeight: 1.7,
    maxWidth: 380,
    marginBottom: 40,
  },
  stats: {
    display: "flex",
    gap: 32,
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  statNum: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 28,
    fontWeight: 800,
    color: "#00C896",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: 500,
  },
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    background: "#fff",
    borderRadius: 20,
    padding: "48px 40px",
    boxShadow: "0 4px 40px rgba(0,0,0,0.08)",
    animation: "fadeUp 0.6s ease",
  },
  formTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 28,
    fontWeight: 800,
    color: "#0A1628",
    marginBottom: 6,
  },
  formSub: {
    fontSize: 14,
    color: "#64748B",
  },
  field: {
    marginBottom: 18,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
    letterSpacing: "0.3px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1.5px solid #E2E8F0",
    borderRadius: 10,
    fontSize: 14,
    color: "#0A1628",
    background: "#F8FAFC",
    transition: "all 0.2s",
  },
  inputError: {
    borderColor: "#EF4444",
    background: "#FFF5F5",
  },
  error: {
    display: "block",
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  serverError: {
    background: "#FFF5F5",
    border: "1px solid #FCA5A5",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    color: "#DC2626",
    marginBottom: 16,
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #00C896, #00A878)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.3px",
    marginTop: 8,
  },
};
