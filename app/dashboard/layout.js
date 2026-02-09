"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/";
    router.push("/login");
  };

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        {/* PROFILE CARD */}
        <div className="profile-card">
          <Image
            src="/sir.jpg"
            alt="Santu Sir"
            width={90}
            height={90}
            className="profile-img"
          />
          <h3>Santu Sir</h3>
          <p>Physics Mentor</p>
        </div>

        {/* MENU */}
        <nav className="menu">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/chapters">Chapters</Link>
          <Link href="/dashboard/mocks">Mock Tests</Link>
          <Link href="/dashboard/results">Results</Link>
        </nav>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main className="content">{children}</main>
    </div>
  );
}
