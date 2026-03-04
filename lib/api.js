const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Health check
export async function getHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error' };
  }
}

// Register user
export async function registerUser(data) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Registration failed');
    }
    
    return res.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Login user
export async function loginUser(credentials) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Login failed');
    }
    
    return res.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Get user profile
export async function getUserProfile(token) {
  try {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    return res.json();
  } catch (error) {
    console.error('User profile error:', error);
    throw error;
  }
}

// Get all questions
export async function getQuestions(token) {
  try {
    const res = await fetch(`${API_BASE}/questions/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch questions');
    }
    
    return res.json();
  } catch (error) {
    console.error('Questions error:', error);
    throw error;
  }
}

// Submit response
export async function submitResponse(data, token) {
  try {
    const res = await fetch(`${API_BASE}/questions/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      throw new Error('Failed to submit response');
    }
    
    return res.json();
  } catch (error) {
    console.error('Submit response error:', error);
    throw error;
  }
}
