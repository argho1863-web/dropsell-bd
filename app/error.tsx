"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "12px" }}>Something went wrong</h1>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>An unexpected error occurred. Please try again.</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{ background: "#16a34a", color: "white", padding: "12px 24px", borderRadius: "12px", fontWeight: "600", border: "none", cursor: "pointer" }}
          >
            Try Again
          </button>
          <a href="/" style={{ border: "2px solid #16a34a", color: "#16a34a", padding: "12px 24px", borderRadius: "12px", fontWeight: "600", textDecoration: "none" }}>
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
