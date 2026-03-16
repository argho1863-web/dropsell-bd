"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, X, Package, ShoppingBag, TrendingUp,
  Upload, Loader2, CheckCircle, Eye, Search,
  LayoutDashboard, RefreshCw, AlertTriangle, Tag
} from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  inStock: boolean;
  createdAt: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  items: { name: string; price: number; quantity: number; image: string }[];
  totalAmount: number;
  paymentMethod: string;
  txnId?: string;
  paymentScreenshot?: string;
  status: string;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
}

type Tab = "dashboard" | "products" | "orders" | "categories";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(false);

  // Product form state
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCategory, setPCategory] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pImage, setPImage] = useState("");
  const [pCloudId, setPCloudId] = useState("");
  const [imgUploading, setImgUploading] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!(session?.user as any)?.isAdmin) {
      router.push("/");
      return;
    }
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
        fetch("/api/categories"),
      ]);
      const [prods, ords, cats] = await Promise.all([
        prodRes.json(),
        ordRes.json(),
        catRes.json(),
      ]);
      setProducts(Array.isArray(prods) ? prods : []);
      setOrders(Array.isArray(ords) ? ords : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setPName(""); setPPrice("");
    setPCategory(categories[0]?.slug || "");
    setPDescription(""); setPImage(""); setPCloudId("");
    setShowProductModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setPName(p.name); setPPrice(String(p.price));
    setPCategory(p.category); setPDescription(p.description);
    setPImage(p.image); setPCloudId("");
    setShowProductModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: base64, folder: "DropSell" }),
        });
        const data = await res.json();
        if (res.ok) {
          setPImage(data.url);
          setPCloudId(data.public_id);
          toast.success("Image uploaded!");
        } else {
          toast.error(data.error || "Upload failed");
        }
        setImgUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Upload failed");
      setImgUploading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pPrice || !pCategory || !pDescription || !pImage) {
      toast.error("All fields including image are required");
      return;
    }
    setSavingProduct(true);
    try {
      const body = {
        name: pName, price: Number(pPrice),
        category: pCategory, description: pDescription,
        image: pImage, cloudinaryId: pCloudId,
      };
      const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(editingProduct ? "Product updated!" : "Product added!");
        setShowProductModal(false);
        fetchAll();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save product");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        setDeleteConfirm(null);
        fetchAll();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Category "${newCategoryName}" added!`);
        setNewCategoryName("");
        fetchAll();
      } else {
        toast.error(data.error || "Failed to add category");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryConfirm) return;
    setDeletingCategory(true);
    try {
      const res = await fetch(`/api/categories/${deleteCategoryConfirm._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Category deleted!");
        setDeleteCategoryConfirm(null);
        fetchAll();
      } else {
        toast.error(data.error || "Failed to delete category");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setDeletingCategory(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success("Status updated");
        fetchAll();
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-bold">Admin Dashboard</span>
            <span className="text-gray-400 text-xs ml-2">Probaho</span>
          </div>
        </div>
        <button onClick={fetchAll} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tab Nav */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-6 w-fit shadow-sm overflow-x-auto">
          {([
            { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { key: "products", label: "Products", icon: Package },
            { key: "orders", label: "Orders", icon: ShoppingBag },
            { key: "categories", label: "Categories", icon: Tag },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                tab === key ? "bg-brand-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Products", value: products.length, color: "bg-blue-500" },
                { label: "Total Orders", value: orders.length, color: "bg-brand-600" },
                { label: "Pending Orders", value: pendingOrders, color: "bg-amber-500" },
                { label: "Total Revenue", value: `৳${totalRevenue.toLocaleString()}`, color: "bg-purple-600" },
              ].map(({ label, value, color }) => (
                <div key={label} className="card p-5">
                  <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
                  <p className="font-display font-extrabold text-2xl text-gray-800">{value}</p>
                </div>
              ))}
            </div>

            <div className="card p-6">
              <h3 className="font-display font-bold text-gray-800 mb-4">Recent Orders</h3>
              {orders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-semibold text-sm text-gray-800">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{order.customerName} — {order.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-700 text-sm">৳{order.totalAmount.toLocaleString()}</p>
                    <span className={`badge ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"} text-[10px] mt-1`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {tab === "products" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="input-field pl-10" />
              </div>
              <button onClick={openAddModal} className="btn-primary flex items-center gap-2 flex-shrink-0">
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div key={product._id} className="card group hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-50 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => openEditModal(product)} className="w-9 h-9 bg-white rounded-xl flex items-center justify-center hover:bg-brand-50 transition text-gray-700">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteConfirm(product._id)} className="w-9 h-9 bg-white rounded-xl flex items-center justify-center hover:bg-red-50 transition text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <span className="badge bg-brand-100 text-brand-700 text-[10px] capitalize mb-1">{product.category}</span>
                    <p className="font-semibold text-sm text-gray-800 truncate mt-1">{product.name}</p>
                    <p className="font-bold text-brand-700 mt-1">৳{product.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-gray-800">All Orders ({orders.length})</h2>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-display font-bold text-gray-800">#{order.orderNumber}</span>
                        <span className={`badge ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>{order.status}</span>
                      </div>
                      <p className="text-sm text-gray-600"><strong>{order.customerName}</strong> — {order.phone}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-700 text-lg">৳{order.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-BD")}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {order.items.map((item, i) => (
                      <span key={i} className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1 text-xs text-gray-600">
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="badge bg-gray-100 text-gray-600 uppercase">{order.paymentMethod}</span>
                      {order.txnId && <span>TxnID: {order.txnId}</span>}
                      {order.paymentScreenshot && (
                        <a href={order.paymentScreenshot} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Screenshot
                        </a>
                      )}
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      {["pending", "confirmed", "shipped", "delivered", "cancelled"].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {tab === "categories" && (
          <div className="space-y-6">
            {/* Add Category */}
            <div className="card p-6">
              <h3 className="font-display font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-600" />
                Add New Category
              </h3>
              <form onSubmit={handleAddCategory} className="flex gap-3">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name e.g. Toys, Food, Furniture"
                  className="input-field flex-1"
                  required
                />
                <button
                  type="submit"
                  disabled={addingCategory || !newCategoryName.trim()}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {addingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add
                </button>
              </form>
            </div>

            {/* Category List */}
            <div className="card p-6">
              <h3 className="font-display font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-brand-600" />
            
