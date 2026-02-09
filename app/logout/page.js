"use client";
import { useEffect } from "react";
import { logout } from "../../lib/auth";

export default function Logout() {
  useEffect(() => logout(), []);
  return <p>Logging out...</p>;
}
