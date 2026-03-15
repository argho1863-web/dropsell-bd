"use client";
import Link from "next/link";
import { Package, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-50 p-4">
      <div className="text-center max-w-md">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-[10rem] font-display font-extrabold text-brand-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-brand-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-brand-600/30 animate-bounce">
              <Package className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <h1 className="font-display font-extrabold text-3xl text-gray-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let&apos;s get you back to shopping!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="btn-primary flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
