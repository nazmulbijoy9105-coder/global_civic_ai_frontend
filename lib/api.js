const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
export async function getHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}
