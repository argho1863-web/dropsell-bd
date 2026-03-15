"use client";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";
import { MessageCircle, Mail, CheckCircle, Phone, ArrowRight, HeadphonesIcon } from "lucide-react";

export default function SupportPage() {
  const { clearCart } = useCart();
  const router = useRouter();

  const handleOK = () => {
    clearCart();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">

        {/* Success animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
              <CheckCircle className="w-12 h-12 text-brand-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-lg animate-bounce">
              🎉
            </div>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-gray-900 mb-2">
            Order Placed!
          </h1>
          <p className="text-brand-600 font-semibold">Please send the message on WhatsApp to confirm your order.</p>
        </div>

        {/* Support card */}
        <div className="card p-8 shadow-xl mb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <HeadphonesIcon className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h2 className="font-display font-bold text-gray-800">Customer Support</h2>
              <p className="text-xs text-gray-400">We&apos;re here to help!</p>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
            ⚠️ <strong>Important:</strong> If the product is not delivered to you within the expected time, 
            please contact us immediately on WhatsApp or Email. We will resolve your issue promptly.
          </p>

          <div className="space-y-3">
            {/* WhatsApp */}
            <a
              href="https://wa.me/8801707776676"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-2xl group hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-green-700 uppercase tracking-wide">WhatsApp</p>
                  <p className="font-bold text-gray-800">01707776676</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Email */}
            <a
              href="mailto:arghoroy339@gmail.com"
              className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-2xl group hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Email</p>
                  <p className="font-bold text-gray-800 text-sm">arghoroy339@gmail.com</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Phone */}
            <a
              href="tel:+8801707776676"
              className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl group hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center shadow-md">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</p>
                  <p className="font-bold text-gray-800">01707776676</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* OK Button */}
        <button
          onClick={handleOK}
          className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4 shadow-lg"
        >
          <CheckCircle className="w-5 h-5" />
          OK — Continue Shopping
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Clicking OK will clear your cart and take you back to the home page.
        </p>
      </div>
    </div>
  );
}
