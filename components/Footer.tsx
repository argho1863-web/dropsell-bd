import React from "react";
import Link from "next/link";
import { Package, Mail, MessageCircle, MapPin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <div className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">Probaho</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-xs">
              Bangladesh trusted online marketplace. Quality products, fast delivery, and genuine customer support across the country.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="https://wa.me/8801707776676" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors">
                <MessageCircle className="w-4 h-4" />
                WhatsApp: 01707776676
              </a>
              <a href="mailto:arghoroy339@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors">
                <Mail className="w-4 h-4" />
                arghoroy339@gmail.com
              </a>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                Bangladesh
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "All Products", href: "/?category=all" },
                { label: "My Cart", href: "#" },
                { label: "Support", href: "/support" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-green-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">We Accept</h4>
            <div className="space-y-2">
              {[
                { name: "bKash", color: "bg-pink-600" },
                { name: "Nagad", color: "bg-orange-600" },
                { name: "Rocket", color: "bg-purple-600" },
                { name: "Cash on Delivery", color: "bg-green-700" },
              ].map((method) => (
                <div key={method.name} className="flex items-center gap-2">
                  <span className={`w-6 h-6 ${method.color} rounded text-xs text-white flex items-center justify-center font-bold`}>T</span>
                  <span className="text-sm text-gray-400">{method.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            {year} Probaho. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Made with love for Bangladesh
          </p>
        </div>
      </div>
    </div>
  );
      }
