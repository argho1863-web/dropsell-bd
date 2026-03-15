"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Search, Zap, Shield, Truck, HeadphonesIcon, TrendingUp, Package, CheckCircle, XCircle, X } from "lucide-react";

const CATEGORIES = ["all", "electronics", "fashion", "home", "beauty", "sports", "books"];

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

interface StatusBanner {
  type: "approved" | "cancelled";
  method: string;
  order: string;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all");
  const [searchInput, setSearchInput] = useState("");
  const [banner, setBanner] = useState<StatusBanner | null>(null);

  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    setActiveCategory(cat);
    const orderstatus = searchParams.get("orderstatus");
    const method = searchParams.get("method") || "cod";
    const order = searchParams.get("order") || "";
    if (orderstatus === "confirmed") setBanner({ type: "approved", method, order });
    else if (orderstatus === "cancelled") setBanner({ type: "cancelled", method, order });
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory && activeCategory !== "all") params.set("category", activeCategory);
        if (search) params.set("search", search);
        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div>
      {/* Status Banner */}
      {banner && (
        <div style={{
          background: banner.type === "approved" ? "#16a34a" : "#ef4444",
          color: "white", padding: "16px", textAlign: "center", position: "relative",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
            {banner.type === "approved" ? (
              <CheckCircle size={20} />
            ) : (
              <XCircle size={20} />
            )}
            <strong style={{ fontSize: "16px" }}>
              {banner.type === "approved"
                ? `Approval Successful! Order #${banner.order} has been placed.`
                : banner.method === "cod"
                ? `Order #${banner.order} — Approval Failed.`
                : `Order #${banner.order} — Approval Failed. You will get your money back within 48 hours.`}
            </strong>
          </div>
          <button
            onClick={() => setBanner(null)}
            style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "white", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Hero Banner */}
      <section style={{ background: "linear-gradient(135deg, #15803d, #16a34a, #22c55e)", color: "white", padding: "64px 16px", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
          <div style={{ maxWidth: "600px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.2)", borderRadius: "99px", padding: "6px 16px", fontSize: "13px", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.3)" }}>
              <Zap size={14} color="#fde047" />
              Bangladesh&apos;s Most Trusted Marketplace
            </div>
            <h1 style={{ fontSize: "42px", fontWeight: "800", lineHeight: "1.1", marginBottom: "16px" }}>
              Shop Smart,{" "}
              <span style={{ color: "#fde047" }}>Save More</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "17px", marginBottom: "28px" }}>
              Quality products with fast delivery across Bangladesh. Cash on Delivery available everywhere!
            </p>
            <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "8px", maxWidth: "440px" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  style={{ width: "100%", paddingLeft: "40px", paddingRight: "16px", paddingTop: "14px", paddingBottom: "14px", borderRadius: "14px", border: "none", outline: "none", fontSize: "14px", boxSizing: "border-box" }}
                />
              </div>
              <button type="submit" style={{ background: "#fde047", color: "#111", fontWeight: "700", padding: "14px 20px", borderRadius: "14px", border: "none", cursor: "pointer", fontSize: "14px" }}>
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section style={{ background: "white", borderBottom: "1px solid #f3f4f6", padding: "12px 16px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
          {[
            { icon: Truck, text: "Fast Delivery", sub: "All over BD" },
            { icon: Shield, text: "Secure Payment", sub: "100% Safe" },
            { icon: Package, text: "Quality Products", sub: "Verified" },
            { icon: HeadphonesIcon, text: "24/7 Support", sub: "WhatsApp" },
          ].map(({ icon: Icon, text, sub }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px" }}>
              <div style={{ width: "36px", height: "36px", background: "#dcfce7", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={18} color="#16a34a" />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: "600", fontSize: "12px", color: "#111827" }}>{text}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" }}>
        {/* Category filters */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "20px" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSearch(""); setSearchInput(""); }}
              style={{
                flexShrink: 0, padding: "8px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: "600",
                cursor: "pointer", border: "none", textTransform: "capitalize",
                background: activeCategory === cat ? "#16a34a" : "white",
                color: activeCategory === cat ? "white" : "#6b7280",
                boxShadow: activeCategory === cat ? "0 2px 8px rgba(22,163,74,0.3)" : "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              {cat === "all" ? "All Products" : cat}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <TrendingUp size={18} color="#16a34a" />
            {search ? `Results for "${search}"` : activeCategory === "all" ? "All Products" : `${activeCategory} Products`}
            {!loading && <span style={{ fontSize: "13px", fontWeight: "400", color: "#9ca3af" }}>({products.length})</span>}
          </h2>
          {search && (
            <button onClick={() => { setSearch(""); setSearchInput(""); }} style={{ fontSize: "12px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>
              Clear search
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ background: "white", borderRadius: "16px", overflow: "hidden", animation: "pulse 1.5s infinite" }}>
                <div style={{ aspectRatio: "1", background: "#f3f4f6" }} />
                <div style={{ padding: "12px" }}>
                  <div style={{ height: "14px", background: "#f3f4f6", borderRadius: "4px", marginBottom: "8px" }} />
                  <div style={{ height: "20px", background: "#f3f4f6", borderRadius: "4px", width: "60%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 16px" }}>
            <Package size={64} color="#e5e7eb" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ color: "#9ca3af", fontSize: "20px", fontWeight: "600" }}>No products found</h3>
            <p style={{ color: "#d1d5db", fontSize: "14px" }}>Try a different search or browse other categories.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f9fafb" }} />}>
      <HomeContent />
    </Suspense>
  );
                                                 }
