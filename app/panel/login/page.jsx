'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '../../../lib/api';

export default function PanelLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Username and password required');
      return;
    }

    try {
      setLoading(true);

      const res = await api.post('/panel/auth/login', {
        username,
        password,
      });

      if (!res) {
        alert('Login failed (no response)');
        return;
      }

      const token = res.token || res?.data?.token;

      if (!token) {
        console.error('Panel login response:', res);
        alert('Login failed (invalid token)');
        return;
      }

      localStorage.removeItem('panel_token');
      localStorage.setItem('panel_token', token);

      console.log('Panel token saved:', token.slice(0, 20) + '...');
      router.push('/panel/dashboard');
    } catch (err) {
      console.error('Panel login error:', err);
      alert('Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background:
          'radial-gradient(circle at top, #0f172a, #020617)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          padding: '28px',
          borderRadius: '18px',
          background: 'linear-gradient(145deg, #020617, #0f172a)',
          border: '1px solid #1e293b',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '22px',
            color: '#e5e7eb',
            fontSize: '26px',
            fontWeight: '600',
          }}
        >
          🔐 Sir Panel Login
        </h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ ...inputStyle, marginTop: '14px' }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '22px',
            padding: '12px',
            borderRadius: '10px',
            border: 'none',
            background: loading
              ? '#334155'
              : 'linear-gradient(135deg, #38bdf8, #2563eb)',
            color: '#020617',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p
          style={{
            marginTop: '18px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#64748b',
          }}
        >
          Physics By Santu Sir
        </p>
      </div>
    </div>
  );
}

/* ===============================
   INPUT STYLE (DESIGN ONLY)
================================ */
const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid #1e293b',
  background: '#020617',
  color: '#e5e7eb',
  fontSize: '14px',
  outline: 'none',
};
