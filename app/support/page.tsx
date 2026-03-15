"use client";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";
import { MessageCircle, Mail, CheckCircle, ArrowRight } from "lucide-react";

export default function SupportPage() {
  const { clearCart } = useCart();
  const router = useRouter();

  const handleOK = () => {
    clearCart();
    router.push("/");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0fdf4, white, #f0fdf4)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ maxWidth: "480px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "80px", height: "80px", background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <CheckCircle size={40} color="#16a34a" />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>Order Placed!</h1>
          <p style={{ color: "#16a34a", fontWeight: "600" }}>You will be notified once your order is approved.</p>
        </div>

        <div style={{ background: "white", borderRadius: "24px", padding: "32px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginBottom: "16px" }}>
          <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
            <p style={{ margin: 0, color: "#92400e", fontSize: "14px", lineHeight: "1.6" }}>
              If the product is not delivered to you, contact us on <strong>WhatsApp</strong> or <strong>Email</strong>. We will resolve your issue promptly.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <a
              href="https://wa.me/8801707776676"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "16px", textDecoration: "none" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", background: "#16a34a", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MessageCircle size={20} color="white" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "11px", color: "#16a34a", fontWeight: "600", textTransform: "uppercase" }}>WhatsApp</p>
                  <p style={{ margin: 0, fontWeight: "700", color: "#111827" }}>01707776676</p>
                </div>
              </div>
              <ArrowRight size={16} color="#16a34a" />
            </a>

            <a
              href="mailto:arghoroy339@gmail.com"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "16px", textDecoration: "none" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", background: "#2563eb", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Mail size={20} color="white" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "11px", color: "#2563eb", fontWeight: "600", textTransform: "uppercase" }}>Email</p>
                  <p style={{ margin: 0, fontWeight: "700", color: "#111827", fontSize: "13px" }}>arghoroy339@gmail.com</p>
                </div>
              </div>
              <ArrowRight size={16} color="#2563eb" />
            </a>
          </div>
        </div>

        <button
          onClick={handleOK}
          style={{ width: "100%", background: "#16a34a", color: "white", fontWeight: "700", fontSize: "16px", padding: "16px", borderRadius: "16px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
        >
          <CheckCircle size={20} />
          OK — Continue Shopping
        </button>
        <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "12px" }}>
          Clicking OK will clear your cart and take you back to the home page.
        </p>
      </div>
    </div>
  );
      }
      
