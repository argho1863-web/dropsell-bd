"use client";
import { useState, useEffect, useCallback } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  inStock: boolean;
}

interface UseProductsOptions {
  category?: string;
  search?: string;
  autoFetch?: boolean;
}

export function useProducts({ category, search, autoFetch = true }: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(
    async (opts?: { category?: string; search?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        const cat = opts?.category ?? category;
        const q = opts?.search ?? search;
        if (cat && cat !== "all") params.set("category", cat);
        if (q) params.set("search", q);

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e.message ?? "Unknown error");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [category, search]
  );

  useEffect(() => {
    if (autoFetch) fetch_();
  }, [autoFetch, fetch_]);

  return { products, loading, error, refetch: fetch_ };
}
