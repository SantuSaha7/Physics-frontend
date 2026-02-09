"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="center-page">
      <div className="card">
        <h1 className="title">Physics by Santu Sir</h1>
        <p className="subtitle">
          Student Portal • Mock Tests • Notes
        </p>

        <button
          className="btn btn-primary"
          onClick={() => router.push("/login")}
        >
          Student Login
        </button>
      </div>
    </div>
  );
}
