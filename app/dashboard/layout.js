'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; Max-Age=0; path=/';
    router.push('/login');
  };

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
        className="student-sidebar"
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
        {/* SIR PROFILE */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Image
            src="/sir.jpg"
            alt="Santu Sir"
            width={80}
            height={80}
            style={{
              borderRadius: '50%',
              border: '2px solid #38bdf8',
              marginBottom: 10,
            }}
          />
          <h3 style={{ margin: 0, fontSize: 16 }}>Santu Sir</h3>
        </div>

        {/* MENU */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Link onClick={() => setOpen(false)} href="/dashboard" className="student-link">
            📊 Dashboard
          </Link>
          <Link onClick={() => setOpen(false)} href="/dashboard/chapters" className="student-link">
            📚 Chapters
          </Link>
          <Link onClick={() => setOpen(false)} href="/dashboard/mocks" className="student-link">
            📝 Mock Tests
          </Link>
          <Link onClick={() => setOpen(false)} href="/dashboard/results" className="student-link">
            📈 Results
          </Link>
        </nav>

        {/* LOGOUT */}
        <button
          onClick={logout}
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
        >
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main
        className="student-main"
        style={{
          minHeight: '100vh',
          padding: 20,
          color: '#e5e7eb',
        }}
      >
        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="student-menu-btn"
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

      {/* ===== RESPONSIVE (SAME AS PANEL) ===== */}
      <style jsx global>{`
        .student-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 10px;
          color: #e5e7eb;
          text-decoration: none;
          font-weight: 500;
        }

        .student-link:hover {
          background: rgba(56, 189, 248, 0.12);
          color: #38bdf8;
        }

        @media (min-width: 768px) {
          .student-sidebar {
            transform: none !important;
          }

          .student-main {
            margin-left: 260px;
            padding: 32px;
          }

          .student-menu-btn {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
