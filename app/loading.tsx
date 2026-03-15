import { Package } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center animate-pulse">
          <Package className="w-8 h-8 text-brand-600" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-brand-400 border-t-transparent animate-spin" />
      </div>
      <div className="space-y-2 text-center">
        <div className="h-3 w-32 bg-gray-200 rounded-full animate-pulse mx-auto" />
        <div className="h-2 w-20 bg-gray-100 rounded-full animate-pulse mx-auto" />
      </div>
    </div>
  );
}
