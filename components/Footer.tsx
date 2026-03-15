import Link from "next/link";
import { Package, Phone, Mail, MessageCircle, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">DropSell BD</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-xs">
              Bangladesh's trusted online marketplace. Quality products, fast delivery, and genuine customer support across the country.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href="https://wa.me/8801707776676"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp: 01707776676
              </a>
              <a
                href="mailto:arghoroy339@gmail.com"
                className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <Mail className="w-4 h-4" />
                arghoroy339@gmail.com
              </a>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                Bangladesh
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 font-display">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "All Products", href: "/?category=all" },
                { label: "My Cart", href: "#" },
                { label: "Support", href: "/support" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-semibold text-white mb-4 font-display">We Accept</h4>
            <div className="space-y-2">
              {[
                { name: "bKash", color: "bg-pink-600", icon: "৳" },
                { name: "Nagad", color: "bg-orange-600", icon: "৳" },
                { name: "Rocket", color: "bg-purple-600", icon: "৳" },
                { name: "Cash on Delivery", color: "bg-brand-600", icon: "💵" },
              ].map((method) => (
                <div key={method.name} className="flex items-center gap-2">
                  <span className={`w-6 h-6 ${method.color} rounded text-xs text-white flex items-center justify-center font-bold`}>
                    {method.icon}
                  </span>
                  <span className="text-sm text-gray-400">{method.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} DropSell BD. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Made with ❤️ for Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
