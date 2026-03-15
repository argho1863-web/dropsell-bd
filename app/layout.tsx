import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "DropSell BD — Bangladesh Trusted Online Marketplace",
  description: "Shop premium products at the best prices. Fast delivery across Bangladesh. Cash on Delivery & Mobile Payment accepted.",
  keywords: "online shopping bangladesh, dropsell bd, buy products online, cash on delivery",
  openGraph: {
    title: "DropSell BD",
    description: "Bangladesh Trusted Online Marketplace",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
