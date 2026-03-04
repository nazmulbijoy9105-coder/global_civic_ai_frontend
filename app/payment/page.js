"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { createPayment, getPaymentHistory, getPaymentStatus } from "../../lib/api";

export default function PaymentPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    if (isAuthenticated) {
      Promise.all([
        getPaymentStatus().catch(() => null),
        getPaymentHistory().catch(() => []),
      ]).then(([s, h]) => {
        setStatus(s);
        setHistory(Array.isArray(h) ? h : []);
        setLoading(false);
      });
    }
  }, [authLoading, isAuthenticated]);

  const handlePayment = async (amount) => {
    setProcessing(true);
    try {
      const result = await createPayment(amount);
      if (result.id) {
        setSuccess(true);
        setStatus({ has_paid: true });
      }
    } catch (e) {
      console.error(e);
    }
    setProcessing(false);
  };

  if (authLoading || loading) {
    return (<><Navbar /><div style={styles.container}><p style={{ color: "#64748B" }}>Loading...</p></div></>);
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>Upgrade Your Plan</h1>
        <p style={styles.subtitle}>Get access to premium features including detailed AI reports and PDF downloads.</p>

        {success && (
          <div style={styles.successBanner}>
            🎉 Payment successful! You now have premium access.
            <a href="/dashboard" style={{ color: "#00C896", marginLeft: 8, fontWeight: 600 }}>Go to Dashboard</a>
          </div>
        )}

        <div style={styles.planGrid}>
          <div style={styles.planCard}>
            <div style={styles.planBadge}>FREE</div>
            <div style={styles.planPrice}><span style={styles.priceLarge}>$0</span>/month</div>
            <ul style={styles.planFeatures}>
              <li>5 Assessments per month</li>
              <li>Basic score summary</li>
              <li>Question bank access</li>
            </ul>
            <div style={{ ...styles.planBtn, background: "#E2E8F0", color: "#64748B" }}>Current Plan</div>
          </div>

          <div style={{ ...styles.planCard, border: "2px solid #00C896" }}>
            <div style={{ ...styles.planBadge, background: "rgba(0,200,150,0.15)", color: "#00C896" }}>PREMIUM</div>
            <div style={styles.planPrice}><span style={styles.priceLarge}>$9.99</span>/month</div>
            <ul style={styles.planFeatures}>
              <li>Unlimited Assessments</li>
              <li>Full AI-powered reports</li>
              <li>PDF report downloads</li>
              <li>Multi-language support</li>
              <li>Priority support</li>
            </ul>
            <button
              onClick={() => handlePayment(9.99)}
              disabled={processing || status?.has_paid}
              style={styles.planBtnPrimary}
            >
              {status?.has_paid ? "Already Premium" : processing ? "Processing..." : "Upgrade Now"}
            </button>
          </div>

          <div style={styles.planCard}>
            <div style={{ ...styles.planBadge, background: "rgba(99,102,241,0.15)", color: "#6366F1" }}>ENTERPRISE</div>
            <div style={styles.planPrice}><span style={styles.priceLarge}>$49</span>/month</div>
            <ul style={styles.planFeatures}>
              <li>Everything in Premium</li>
              <li>Team management</li>
              <li>Custom question banks</li>
              <li>API access</li>
              <li>Dedicated support</li>
            </ul>
            <div style={{ ...styles.planBtn, background: "#6366F1", color: "#fff" }}>Contact Us</div>
          </div>
        </div>

        {history.length > 0 && (
          <div style={styles.historySection}>
            <h2 style={styles.sectionTitle}>Payment History</h2>
            {history.map((p) => (
              <div key={p.id} style={styles.historyItem}>
                <span>${p.amount} {p.currency}</span>
                <span style={styles.historyDate}>{new Date(p.timestamp).toLocaleDateString()}</span>
                <span style={{ ...styles.historyStatus, color: p.status === "completed" ? "#00C896" : "#EAB308" }}>{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  container: { maxWidth: 1000, margin: "0 auto", padding: "40px 24px" },
  title: { fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: "#0A1628", marginBottom: 8, textAlign: "center" },
  subtitle: { color: "#64748B", fontSize: 15, textAlign: "center", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" },
  successBanner: { background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.3)", borderRadius: 12, padding: "16px 20px", textAlign: "center", marginBottom: 24, color: "#0A1628", fontSize: 15 },
  planGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, marginBottom: 40 },
  planCard: { background: "#fff", borderRadius: 20, padding: "32px 28px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)", textAlign: "center" },
  planBadge: { display: "inline-block", background: "#F1F5F9", padding: "4px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: "1px", marginBottom: 16, color: "#64748B" },
  planPrice: { fontSize: 16, color: "#64748B", marginBottom: 20 },
  priceLarge: { fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: "#0A1628" },
  planFeatures: { listStyle: "none", padding: 0, marginBottom: 24, textAlign: "left" },
  planBtn: { display: "block", padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 600, textAlign: "center" },
  planBtnPrimary: { display: "block", width: "100%", padding: "14px", background: "linear-gradient(135deg, #00C896, #00A878)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  historySection: { marginTop: 32 },
  sectionTitle: { fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: "#0A1628", marginBottom: 16 },
  historyItem: { background: "#fff", borderRadius: 10, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, boxShadow: "0 1px 8px rgba(0,0,0,0.04)", fontSize: 14 },
  historyDate: { color: "#64748B" },
  historyStatus: { fontWeight: 600, fontSize: 13 },
};
