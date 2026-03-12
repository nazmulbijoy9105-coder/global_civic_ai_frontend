import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://global-civic-ai-backend.onrender.com";

// --- AUTH ---
export async function loginUser(credentials) {
  const res = await axios.post(`${API_BASE}/auth/login`, credentials);
  return res.data;
}
export async function getCurrentUser() {
  const res = await axios.get(`${API_BASE}/users/me`);
  return res.data;
}

// --- ASSESSMENT ---
export async function getAssessmentHistory(userId) {
  const res = await axios.get(`${API_BASE}/assessment/history/${userId}`);
  return res.data;
}
export async function getAssessmentReport(userId) {
  const res = await axios.get(`${API_BASE}/assessment/report/${userId}`);
  return res.data;
}
export async function getSessionQuestions(sessionId) {
  const res = await axios.get(`${API_BASE}/assessment/session/${sessionId}/questions`);
  return res.data;
}
export async function getSessionReport(sessionId) {
  const res = await axios.get(`${API_BASE}/assessment/report/${sessionId}`);
  return res.data;
}

// --- PAYMENTS ---
export async function getPaymentStatus(userId) {
  const res = await axios.get(`${API_BASE}/payments/status/${userId}`);
  return res.data;
}
