const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function registerUser({ username, email, password }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Signup failed");
  return data;
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  return data;
}

export async function getAssessment() {
  const res = await fetch(`${API_URL}/questions/assessment`);
  const data = await res.json();
  if (!res.ok) throw new Error("Failed to load questions");
  return data;
}

export async function getRandomQuestion() {
  const res = await fetch(`${API_URL}/questions/random`);
  const data = await res.json();
  if (!res.ok) throw new Error("Failed to load question");
  return data;
}

export async function checkHealth() {
  const res = await fetch(`${API_URL}/health`);
  return res.json();
}
