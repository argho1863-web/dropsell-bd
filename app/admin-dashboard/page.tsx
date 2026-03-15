"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, X, Package, ShoppingBag, TrendingUp,
  Users, Upload, Loader2, CheckCircle, Eye, Search, Filter,
  LayoutDashboard, RefreshCw, AlertTriangle
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

type Tab = "dashboard" | "products" | "orders";

const CATEGORIES = ["electronics", "fashion", "home", "beauty", "sports", "books", "other"];
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
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Product form state
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCategory, setPCategory] = useState("electronics");
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
  }, [session, status]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
      ]);
      const [prods, ords] = await Promise.all([prodRes.json(), ordRes.json()]);
      setProducts(Array.isArray(prods) ? prods : []);
      setOrders(Array.isArray(ords) ? ords : []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setPName(""); setPPrice(""); setPCategory("electronics");
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
      {/* Admin Top Bar */}
      <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-bold">Admin Dashboard</span>
            <span className="text-gray-400 text-xs ml-2">DropSell BD</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchAll} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition">
            <RefreshCw className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-400">{session?.user?.email}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tab Nav */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-6 w-fit shadow-sm">
          {([
            { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { key: "products", label: "Products", icon: Package },
            { key: "orders", label: "Orders", icon: ShoppingBag },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === key
                  ? "bg-brand-600 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {tab === "dashboard" && (
          <div className="space-y-6 page-enter">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Products", value: products.length, icon: Package, color: "bg-blue-500", light: "bg-blue-50 text-blue-700" },
                { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "bg-brand-600", light: "bg-brand-50 text-brand-700" },
                { label: "Pending Orders", value: pendingOrders, icon: TrendingUp, color: "bg-amber-500", light: "bg-amber-50 text-amber-700" },
                { label: "Total Revenue", value: `৳${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "bg-purple-600", light: "bg-purple-50 text-purple-700" },
              ].map(({ label, value, icon: Icon, color, light }) => (
                <div key={label} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-gray-500">{label}</p>
                    <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center shadow`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className={`font-display font-extrabold text-2xl ${light.split(" ")[1]}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="card p-6">
              <h3 className="font-display font-bold text-gray-800 mb-4">Recent Orders</h3>
              {orders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-semibold text-sm text-gray-800">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{order.customerName} • {order.phone}</p>
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
          <div className="space-y-4 page-enter">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="input-field pl-10"
                />
              </div>
              <button
                onClick={openAddModal}
                className="btn-primary flex items-center gap-2 flex-shrink-0"
              >
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
                      <button
                        onClick={() => openEditModal(product)}
                        className="w-9 h-9 bg-white rounded-xl flex items-center justify-center hover:bg-brand-50 transition text-gray-700"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product._id)}
                        className="w-9 h-9 bg-white rounded-xl flex items-center justify-center hover:bg-red-50 transition text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <span className="badge bg-brand-100 text-brand-700 text-[10px] capitalize mb-1">
                      {product.category}
                    </span>
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
          <div className="space-y-4 page-enter">
            <h2 className="font-display font-bold text-gray-800">All Orders ({orders.length})</h2>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-display font-bold text-gray-800">#{order.orderNumber}</span>
                        <span className={`badge ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>{order.customerName}</strong> • {order.phone}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-700 text-lg">৳{order.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-BD")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {order.items.map((item, i) => (
                      <span key={i} className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1 text-xs text-gray-600">
                        {item.name} ×{item.quantity}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="badge bg-gray-100 text-gray-600 uppercase">{order.paymentMethod}</span>
                      {order.txnId && <span>TxnID: {order.txnId}</span>}
                      {order.paymentScreenshot && (
                        <a href={order.paymentScreenshot} target="_blank" rel="noopener noreferrer"
                          className="text-brand-600 hover:underline flex items-center gap-1">
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
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-slide-up my-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-gray-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowProductModal(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Image upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Image *</label>
                <input ref={imgInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {pImage ? (
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden border-2 border-brand-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setPImage(""); setPCloudId(""); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => imgInputRef.current?.click()}
                    disabled={imgUploading}
                    className="w-full border-2 border-dashed border-gray-300 rounded-2xl py-8 text-center hover:border-brand-400 hover:bg-brand-50 transition-all disabled:opacity-50"
                  >
                    {imgUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 text-brand-600 animate-spin mx-auto" />
                        <span className="text-sm text-brand-600">Uploading to Cloudinary...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <span className="text-sm text-gray-500">Click to upload product image</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Name *</label>
                <input type="text" value={pName} onChange={(e) => setPName(e.target.value)}
                  placeholder="e.g. Wireless Earbuds Pro" className="input-field" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price (BDT) *</label>
                  <input type="number" value={pPrice} onChange={(e) => setPPrice(e.target.value)}
                    placeholder="e.g. 1499" className="input-field" min="1" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category *</label>
                  <select value={pCategory} onChange={(e) => setPCategory(e.target.value)} className="input-field">
                    {CATEGORIES.map(c => (
                      <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description *</label>
                <textarea value={pDescription} onChange={(e) => setPDescription(e.target.value)}
                  placeholder="Product description..." className="input-field resize-none" rows={3} required />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowProductModal(false)}
                  className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={savingProduct || imgUploading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                  {savingProduct ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {savingProduct ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 animate-slide-up text-center">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="font-display font-bold text-gray-900 text-xl mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-6">This will permanently delete the product and its image from Cloudinary.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-outline flex-1">Cancel</button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
