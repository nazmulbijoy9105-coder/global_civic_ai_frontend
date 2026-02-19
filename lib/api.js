const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://global-civic-ai-backend.onrender.com";

export async function getHealth() {
  return (await fetch(`${API_BASE}/health`)).json();
}

export async function loginUser(credentials) {
  return (
    await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
  ).json();
}

export async function registerUser(data) {
  return (
    await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  ).json();
}

export async function getCurrentUser(token) {
  return (
    await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).json();
}
