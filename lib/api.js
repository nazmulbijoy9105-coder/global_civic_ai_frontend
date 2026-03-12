import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://global-civic-ai-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
});

// --- AXIOS INTERCEPTOR ---
// This automatically adds the Bearer token to every request if it exists in localStorage
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- AUTH ---

/**
 * Fix: Backend uses OAuth2PasswordRequestForm which requires x-www-form-urlencoded
 */
export async function loginUser(credentials) {
  const params = new URLSearchParams();
  params.append("username", credentials.username);
  params.append("password", credentials.password);

  const res = await api.post("/auth/login", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  
  // Store token immediately for interceptor use
  if (res.data.access_token) {
    localStorage.setItem("token", res.data.access_token);
  }
  
  return res.data;
}

export async function getCurrentUser() {
  const res = await api.get("/auth/me"); // Note: backend route is /auth/me per your auth.py
  return res.data;
}

export function logoutUser() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

// --- ASSESSMENT ---

export async function getAssessmentHistory(userId) {
  const res = await api.get(`/assessment/history/${userId}`);
  return res.data;
}

export async function getAssessmentReport(userId) {
  const res = await api.get(`/assessment/report/${userId}`);
  return res.data;
}

export async function getSessionQuestions(sessionId) {
  const res = await api.get(`/assessment/session/${sessionId}/questions`);
  return res.data;
}

export async function getSessionReport(sessionId) {
  const res = await api.get(`/assessment/report/${sessionId}`);
  return res.data;
}

// --- PAYMENTS ---

export async function getPaymentStatus(userId) {
  const res = await api.get(`/payments/status/${userId}`);
  return res.data;
}

export default api;