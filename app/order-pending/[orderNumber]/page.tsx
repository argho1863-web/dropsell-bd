"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Clock, MessageCircle } from "lucide-react";

export default function OrderPendingPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;
  const [status, setStatus] = useState("pending");
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 500);
    return () => clearInterval(dotInterval);
  }, []);

  useEffect(() => {
    if (!orderNumber) return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/orders/status/${orderNumber}`);
        const data = await res.json();
        if (data.status) {
          setStatus(data.status);
          if (data.status === "confirmed" || data.status === "cancelled") {
            clearInterval(interval);
            setTimeout(() => {
              router.push(`/?orderstatus=${data.status}&method=${data.paymentMethod || "cod"}&order=${orderNumber}`);
            }, 2000);
          }
        }
      } catch {
        // silent fail, keep polling
      }
    };

    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [orderNumber, router]);

  if (status === "confirmed") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0fdf4", padding: "16px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{ width: "80px", height: "80px", background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <CheckCircle size={40} color="#16a34a" />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#15803d", marginBottom: "8px" }}>Order Approved!</h1>
          <p style={{ color: "#16a34a", fontSize: "16px" }}>Redirecting you now...</p>
        </div>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fef2f2", padding: "16px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{ width: "80px", height: "80px", background: "#fee2e2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <XCircle size={40} color="#ef4444" />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#dc2626", marginBottom: "8px" }}>Order Cancelled</h1>
          <p style={{ color: "#ef4444", fontSize: "16px" }}>Redirecting you now...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", padding: "16px" }}>
      <div style={{ textAlign: "center", maxWidth: "480px", width: "100%" }}>
        <div style={{ background: "white", borderRadius: "24px", padding: "40px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ width: "80px", height: "80px", margin: "0 auto 24px", position: "relative" }}>
            <div style={{ width: "80px", height: "80px", border: "6px solid #dcfce7", borderTop: "6px solid #16a34a", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={28} color="#16a34a" />
            </div>
          </div>

          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>
            Order Pending
          </h1>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#16a34a", marginBottom: "16px" }}>
            Waiting for approval{dots}
          </p>

          <div style={{ background: "#f0fdf4", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
            <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#6b7280" }}>Order Number</p>
            <p style={{ margin: "0", fontSize: "20px", fontWeight: "800", color: "#15803d" }}>{orderNumber}</p>
          </div>

          <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
            Your order has been received and is waiting for admin approval. This page will automatically update when your order is approved or cancelled.
          </p>

          <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "16px", fontSize: "13px", color: "#374151" }}>
            <p style={{ margin: "0 0 8px", fontWeight: "600" }}>Need help?</p>
            <a
              href="https://wa.me/8801707776676"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#22c55e", color: "white", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "13px" }}
            >
              <MessageCircle size={14} />
              WhatsApp: 01707776676
            </a>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
      }
                       
