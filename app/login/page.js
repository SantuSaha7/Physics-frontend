"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      document.cookie = `token=${data.token}; path=/`;

      router.push("/dashboard");
    } catch {
      setError("Server not responding");
    }
  };

  return (
    <div className="center-page">
      <form className="card" onSubmit={handleLogin}>
        <h1 className="title">Student Login</h1>
        <p className="subtitle">
          Enter your Student ID and Password
        </p>

        <div className="form-group">
          <input
            className="input"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Login
        </button>

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
