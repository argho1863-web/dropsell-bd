"use client";
import { useState } from "react";
import { useCart } from "./CartContext";
import { ShoppingCart, Check, Star, Zap } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgError ? "/placeholder-product.png" : product.image}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2">
          <span className="badge bg-brand-100 text-brand-700 capitalize text-[10px]">
            {product.category}
          </span>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="badge bg-amber-100 text-amber-700">
            <Star className="w-2.5 h-2.5 mr-0.5 fill-amber-400 text-amber-400" />
            4.8
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-1 font-display">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs line-clamp-2 mb-3 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-xs text-gray-400 line-through">৳{Math.round(product.price * 1.2).toLocaleString()}</p>
            <p className="text-brand-700 font-bold text-lg font-display">
              ৳{product.price.toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 active:scale-95 ${
              added
                ? "bg-green-100 text-green-700"
                : "bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-brand-600/30"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
