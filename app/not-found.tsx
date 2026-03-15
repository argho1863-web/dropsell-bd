"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <div style={{ fontSize: "80px", fontWeight: "800", color: "#16a34a" }}>404</div>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "12px" }}>Page Not Found</h1>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          The page you are looking for does not exist.
        </p>
        <Link href="/" style={{ background: "#16a34a", color: "white", padding: "12px 24px", borderRadius: "12px", fontWeight: "600", textDecoration: "none" }}>
          Go to Home
        </Link>
      </div>
    </div>
  );
}
