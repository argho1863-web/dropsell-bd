"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import {
  Search, SlidersHorizontal, Zap, Shield, Truck, HeadphonesIcon,
  ChevronRight, Star, TrendingUp, Package
} from "lucide-react";

const CATEGORIES = ["all", "electronics", "fashion", "home", "beauty", "sports", "books"];

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    setActiveCategory(cat);
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
    <div className="page-enter">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-5 border border-white/30">
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span>Bangladesh&apos;s Most Trusted Marketplace</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-tight mb-4">
              Shop Smart,<br />
              <span className="text-yellow-300">Save More</span> 🛒
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Discover thousands of quality products with fast delivery across Bangladesh. 
              Cash on Delivery available everywhere!
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3.5 rounded-2xl transition-colors shadow-lg active:scale-95"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, text: "Fast Delivery", sub: "All over BD" },
              { icon: Shield, text: "Secure Payment", sub: "100% Safe" },
              { icon: Package, text: "Quality Products", sub: "Verified Sellers" },
              { icon: HeadphonesIcon, text: "24/7 Support", sub: "WhatsApp & Email" },
            ].map(({ icon: Icon, text, sub }) => (
              <div key={text} className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-brand-600 w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{text}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSearch(""); setSearchInput(""); }}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-brand-300 hover:text-brand-600"
              }`}
            >
              {cat === "all" ? "🏠 All Products" : cat}
            </button>
          ))}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-600" />
            {search ? `Results for "${search}"` : activeCategory === "all" ? "All Products" : `${activeCategory} Products`}
            {!loading && (
              <span className="text-sm font-normal text-gray-400">({products.length})</span>
            )}
          </h2>
          {search && (
            <button
              onClick={() => { setSearch(""); setSearchInput(""); }}
              className="text-xs text-red-500 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-8 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-gray-500 text-xl mb-2">No products found</h3>
            <p className="text-gray-400 text-sm">Try a different search or browse other categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <HomeContent />
    </Suspense>
  );
}
