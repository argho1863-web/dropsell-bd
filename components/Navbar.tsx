"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "./CartContext";
import { ShoppingCart, Menu, X, User, LogOut, Shield, ChevronDown, Package } from "lucide-react";
import AdminPasswordModal from "./AdminPasswordModal";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { data: session } = useSession();
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isAdmin = (session?.user as any)?.isAdmin;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <nav className={`sticky top-0 z-40 bg-white transition-all duration-300 ${scrolled ? "shadow-md" : "border-b border-gray-100"}`}>
        <div className="bg-brand-700 text-white text-xs text-center py-1.5 px-4 font-medium">
          Free Delivery on orders above 999 BDT | Cash on Delivery Available
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-extrabold text-xl text-brand-700 leading-none block">
                  Probaho
                </span>
                <span className="text-[10px] text-gray-400 font-body leading-none tracking-widest uppercase">
                  Bangladesh
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
              <Link href="/?category=electronics" className="hover:text-brand-600 transition-colors">Electronics</Link>
              <Link href="/?category=fashion" className="hover:text-brand-600 transition-colors">Fashion</Link>
              <Link href="/?category=home" className="hover:text-brand-600 transition-colors">Home & Living</Link>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 rounded-xl hover:bg-brand-50 text-gray-600 hover:text-brand-600 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </button>

              {isAdmin && (
                <button
                  onClick={() => setAdminModalOpen(true)}
                  className="hidden md:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-amber-100 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </button>
              )}

              {session ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center overflow-hidden">
                      {session.user?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={session.user.image} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-brand-600" />
                      )}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {session.user?.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{session.user?.email}</p>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => { setUserMenuOpen(false); setAdminModalOpen(true); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Dashboard
                        </button>
                      )}
                      <button
                        onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="hidden md:flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}

              <button
                className="md:hidden p-2.5 rounded-xl hover:bg-gray-50 text-gray-600"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 space-y-1">
            {["Home", "Electronics", "Fashion", "Home & Living"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/?category=${item.toLowerCase().replace(" & ", "-")}`}
                className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </Link>
            ))}
            {isAdmin && (
              <button
                onClick={() => { setMobileOpen(false); setAdminModalOpen(true); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-amber-700 bg-amber-50 rounded-xl"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </button>
            )}
            {!session && (
              <Link
                href="/auth/signin"
                className="flex items-center justify-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold mt-2"
                onClick={() => setMobileOpen(false)}
              >
                <User className="w-4 h-4" />
                Sign In / Sign Up
              </Link>
            )}
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AdminPasswordModal open={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </>
  );
      }
