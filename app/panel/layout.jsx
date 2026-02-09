'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PanelLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // ❗ login page এ sidebar দেখাবে না
  if (pathname === '/panel/login') {
    return <>{children}</>;
  }

  const isActive = (path) => pathname.startsWith(path);

  const linkStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 12px',
    borderRadius: 10,
    color: active ? '#38bdf8' : '#e5e7eb',
    textDecoration: 'none',
    fontWeight: active ? 600 : 500,
    background: active ? 'rgba(56,189,248,0.12)' : 'transparent',
    borderLeft: active ? '4px solid #38bdf8' : '4px solid transparent',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#020617' }}>
      {/* ===== OVERLAY (MOBILE) ===== */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 20,
          }}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className="panel-sidebar"
        style={{
          width: 240,
          background: '#020617',
          color: '#fff',
          padding: '24px 18px',
          borderRight: '1px solid #1e293b',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 30,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* PANEL TITLE */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ margin: 0, fontSize: 20, color: '#38bdf8' }}>
            Sir Panel
          </h2>
          <p style={{ margin: 0, fontSize: 12, opacity: 0.6 }}>
            Admin Dashboard
          </p>
        </div>

        {/* NAV */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Link onClick={() => setOpen(false)} href="/panel/dashboard" style={linkStyle(isActive('/panel/dashboard'))}>
            📊 Dashboard
          </Link>
          <Link onClick={() => setOpen(false)} href="/panel/classes" style={linkStyle(isActive('/panel/classes'))}>
            🏫 Classes
          </Link>
          <Link onClick={() => setOpen(false)} href="/panel/chapters" style={linkStyle(isActive('/panel/chapters'))}>
            📚 Chapters
          </Link>
          <Link onClick={() => setOpen(false)} href="/panel/students" style={linkStyle(isActive('/panel/students'))}>
            👨‍🎓 Students
          </Link>
          <Link onClick={() => setOpen(false)} href="/panel/mocks" style={linkStyle(isActive('/panel/mocks'))}>
            📝 Mock Tests
          </Link>
          <Link onClick={() => setOpen(false)} href="/panel/results" style={linkStyle(isActive('/panel/results'))}>
            📈 Results
          </Link>
        </nav>

        {/* LOGOUT */}
        <button
          style={{
            marginTop: 40,
            width: '100%',
            padding: '10px',
            borderRadius: 10,
            background: 'transparent',
            border: '1px solid #ef4444',
            color: '#ef4444',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => {
            localStorage.removeItem('panel_token');
            router.push('/panel/login');
          }}
        >
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main
        className="panel-main"
        style={{
          minHeight: '100vh',
          padding: 20,
          color: '#e5e7eb',
        }}
      >
        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="panel-menu-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
            background: '#020617',
            border: '1px solid #1e293b',
            color: '#38bdf8',
            padding: '8px 12px',
            borderRadius: 10,
            cursor: 'pointer',
          }}
        >
          ☰ Menu
        </button>

        {children}
      </main>

      {/* ===== RESPONSIVE FIX ===== */}
      <style jsx global>{`
        @media (min-width: 768px) {
          .panel-sidebar {
            transform: none !important;
          }

          .panel-main {
            margin-left: 260px;
            padding: 32px;
          }

          .panel-menu-btn {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
