const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

function authHeaders(token) {
  const t = token || getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// Health
export async function getHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

// Auth
export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return res.json();
}

export async function registerUser(data) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getCurrentUser(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: authHeaders(token),
  });
  return res.json();
}

// Questions
export async function getQuestions(category) {
  const url = category
    ? `${API_BASE}/questions/?category=${category}`
    : `${API_BASE}/questions/`;
  const res = await fetch(url, { headers: authHeaders() });
  return res.json();
}

export async function getRandomQuestions(count = 20) {
  const res = await fetch(`${API_BASE}/questions/random?count=${count}`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/questions/categories`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function seedQuestions() {
  const res = await fetch(`${API_BASE}/questions/seed`, {
    method: "POST",
    headers: authHeaders(),
  });
  return res.json();
}

// Assessment
export async function startAssessment(totalQuestions = 20) {
  const res = await fetch(`${API_BASE}/assessment/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ total_questions: totalQuestions }),
  });
  return res.json();
}

export async function getSessionQuestions(sessionId) {
  const res = await fetch(
    `${API_BASE}/assessment/session/${sessionId}/questions`,
    { headers: authHeaders() }
  );
  return res.json();
}

export async function submitAnswer(sessionId, questionId, answer, score) {
  const res = await fetch(
    `${API_BASE}/assessment/session/${sessionId}/answer`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ question_id: questionId, answer, score }),
    }
  );
  return res.json();
}

export async function completeSession(sessionId) {
  const res = await fetch(
    `${API_BASE}/assessment/session/${sessionId}/complete`,
    { method: "POST", headers: authHeaders() }
  );
  return res.json();
}

export async function getSessionReport(sessionId) {
  const res = await fetch(
    `${API_BASE}/assessment/session/${sessionId}/report`,
    { headers: authHeaders() }
  );
  return res.json();
}

export async function getAssessmentHistory() {
  const res = await fetch(`${API_BASE}/assessment/history`, {
    headers: authHeaders(),
  });
  return res.json();
}

// Report PDF
export function getReportPdfUrl(sessionId) {
  const token = getToken();
  return `${API_BASE}/report/pdf/${sessionId}?token=${token}`;
}

// Payments
export async function createPayment(amount, currency = "USD", method = "card") {
  const res = await fetch(`${API_BASE}/payments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ amount, currency, payment_method: method }),
  });
  return res.json();
}

export async function getPaymentHistory() {
  const res = await fetch(`${API_BASE}/payments/history`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getPaymentStatus() {
  const res = await fetch(`${API_BASE}/payments/status`, {
    headers: authHeaders(),
  });
  return res.json();
}

// Admin
export async function getAdminStatus() {
  const res = await fetch(`${API_BASE}/admin/status`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getAdminUsers() {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getAdminSessions() {
  const res = await fetch(`${API_BASE}/admin/sessions`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getAdminScores() {
  const res = await fetch(`${API_BASE}/admin/scores`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: authHeaders(),
  });
  return res.json();
}
