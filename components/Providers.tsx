"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./CartContext";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "'DM Sans', sans-serif",
              borderRadius: "10px",
              background: "#fff",
              color: "#1f2937",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            },
            success: { iconTheme: { primary: "#16a34a", secondary: "#fff" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          }}
        />
      </CartProvider>
    </SessionProvider>
  );
}
