const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function startAssessment(numQuestions = 20) {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE}/assessment/start?num_questions=${numQuestions}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).detail || 'Failed to start');
  return res.json();
}

export async function getSessionQuestions(sessionId) {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE}/assessment/${sessionId}/questions`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).detail || 'Failed to fetch');
  return res.json();
}

export async function submitAnswer(sessionId, questionId, answer, score) {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE}/assessment/${sessionId}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ session_id: sessionId, question_id: questionId, answer, score })
  });
  if (!res.ok) throw new Error((await res.json()).detail || 'Failed to submit');
  return res.json();
}

export async function completeSession(sessionId) {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE}/assessment/${sessionId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).detail || 'Failed to complete');
  return res.json();
}

export async function getAssessmentReport(sessionId) {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE}/assessment/${sessionId}/report`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).detail || 'Failed to fetch');
  return res.json();
}
