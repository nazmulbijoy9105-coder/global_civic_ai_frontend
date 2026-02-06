'use client'

import { useState } from 'react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Signup with Email: ${email} Password: ${password}`);
  };

  return (
    <main>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label><br/>
        <input 
          type='email' 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
        /><br/>
        <label>Password:</label><br/>
        <input 
          type='password' 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
        /><br/><br/>
        <button type='submit'>Sign Up</button>
      </form>
    </main>
  );
}

