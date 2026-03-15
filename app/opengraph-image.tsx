import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DropSell BD — Bangladesh's Trusted Marketplace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 400, height: 400, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60,
          width: 300, height: 300, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }} />

        {/* Logo box */}
        <div style={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: 24,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 32,
          border: "1px solid rgba(255,255,255,0.25)",
        }}>
          <div style={{
            width: 56, height: 56,
            background: "white",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}>
            🛍️
          </div>
          <span style={{ color: "white", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
            DropSell BD
          </span>
        </div>

        <h1 style={{
          color: "white",
          fontSize: 52,
          fontWeight: 800,
          textAlign: "center",
          margin: 0,
          lineHeight: 1.1,
          padding: "0 60px",
        }}>
          Bangladesh&apos;s Trusted Online Marketplace
        </h1>

        <p style={{
          color: "rgba(255,255,255,0.8)",
          fontSize: 24,
          marginTop: 20,
          textAlign: "center",
        }}>
          Fast Delivery · Cash on Delivery · bKash · Nagad · Rocket
        </p>

        {/* Badges */}
        <div style={{ display: "flex", gap: 16, marginTop: 36 }}>
          {["🚚 All Over Bangladesh", "✅ 100% Secure", "💬 24/7 WhatsApp Support"].map((badge) => (
            <div key={badge} style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 40,
              padding: "8px 20px",
              color: "white",
              fontSize: 16,
              fontWeight: 600,
            }}>
              {badge}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
