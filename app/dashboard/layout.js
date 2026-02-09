"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/";
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#070b1a] text-white">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static z-50
          top-0 left-0 h-full
          w-64 md:w-72
          bg-[#0b1025]
          flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* PROFILE */}
        <div className="p-6 text-center border-b border-white/10">
          <Image
            src="/sir.jpg"
            alt="Santu Sir"
            width={90}
            height={90}
            className="mx-auto rounded-full border-2 border-green-500"
          />
          <h3 className="mt-3 text-lg font-semibold">Santu Sir</h3>
          <p className="text-sm text-gray-400">Physics Mentor</p>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-2 p-6">
          <Link href="/dashboard" className="sidebar-link">
            Dashboard
          </Link>
          <Link href="/dashboard/chapters" className="sidebar-link">
            Chapters
          </Link>
          <Link href="/dashboard/mocks" className="sidebar-link">
            Mock Tests
          </Link>
          <Link href="/dashboard/results" className="sidebar-link">
            Results
          </Link>
        </nav>

        {/* LOGOUT */}
        <div className="p-6">
          <button
            onClick={logout}
            className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col md:ml-72">
        {/* TOP BAR (MOBILE ONLY) */}
        <header className="md:hidden flex items-center gap-3 p-4 bg-[#0b1025] border-b border-white/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl"
          >
            ☰
          </button>
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>

      {/* SIMPLE SIDEBAR LINK STYLE */}
      <style jsx>{`
        .sidebar-link {
          padding: 10px 14px;
          border-radius: 10px;
          color: #cbd5f5;
          transition: background 0.2s;
        }
        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </div>
  );
}
