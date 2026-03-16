"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Package, ShoppingBag, TrendingUp, Upload, Loader2, CheckCircle, Eye, Search, LayoutDashboard, RefreshCw, AlertTriangle, Tag } from "lucide-react";
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
      const [prods, ords, cats] = await Promise.all([prodRes.json(), ordRes.json(), catRes.json()]);
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
      const body = { name: pName, price: Number(pPrice), category: pCategory, description: pDescription, image: pImage, cloudinaryId: pCloudId };
      const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
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
      const res = await fetch(`/api/categories/${deleteCategoryConfirm._id}`, { method: "DELETE" });
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
      if (res.ok) { toast.success("Status updated"); fetchAll(); }
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f9fafb"}}>
        <div style={{textAlign:"center"}}>
          <Loader2 size={40} color="#16a34a" style={{animation:"spin 1s linear infinite",margin:"0 auto 12px"}} />
          <p style={{color:"#6b7280",fontWeight:"500"}}>Loading admin panel...</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{minHeight:"100vh",background:"#f9fafb"}}>
      <div style={{background:"#111827",color:"white",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <div style={{width:"32px",height:"32px",background:"#16a34a",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <LayoutDashboard size={16} color="white" />
          </div>
          <span style={{fontWeight:"700",fontSize:"16px"}}>Admin Dashboard — Probaho</span>
        </div>
        <button onClick={fetchAll} style={{background:"transparent",border:"none",color:"#9ca3af",cursor:"pointer",padding:"8px"}}>
          <RefreshCw size={16} />
        </button>
      </div>

      <div style={{maxWidth:"1200px",margin:"0 auto",padding:"24px 16px"}}>
        <div style={{display:"flex",gap:"4px",background:"white",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"4px",marginBottom:"24px",width:"fit-content",overflowX:"auto"}}>
          {([
            { key:"dashboard", label:"Dashboard", icon:LayoutDashboard },
            { key:"products", label:"Products", icon:Package },
            { key:"orders", label:"Orders", icon:ShoppingBag },
            { key:"categories", label:"Categories", icon:Tag },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)} style={{display:"flex",alignItems:"center",gap:"8px",padding:"10px 16px",borderRadius:"12px",fontSize:"13px",fontWeight:"600",border:"none",cursor:"pointer",whiteSpace:"nowrap",background:tab===key?"#16a34a":"transparent",color:tab===key?"white":"#6b7280"}}>
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {tab === "dashboard" && (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"16px",marginBottom:"24px"}}>
              {[
                { label:"Total Products", value:products.length },
                { label:"Total Orders", value:orders.length },
                { label:"Pending Orders", value:pendingOrders },
                { label:"Total Revenue", value:`৳${totalRevenue.toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} style={{background:"white",borderRadius:"16px",padding:"20px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
                  <p style={{margin:"0 0 8px",fontSize:"12px",color:"#6b7280",fontWeight:"500"}}>{label}</p>
                  <p style={{margin:0,fontSize:"24px",fontWeight:"800",color:"#111827"}}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{background:"white",borderRadius:"16px",padding:"24px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <h3 style={{margin:"0 0 16px",fontSize:"16px",fontWeight:"700",color:"#111827"}}>Recent Orders</h3>
              {orders.slice(0,5).map((order) => (
                <div key={order._id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #f9fafb"}}>
                  <div>
                    <p style={{margin:0,fontWeight:"600",fontSize:"14px",color:"#111827"}}>#{order.orderNumber}</p>
                    <p style={{margin:0,fontSize:"12px",color:"#9ca3af"}}>{order.customerName} — {order.phone}</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <p style={{margin:0,fontWeight:"700",color:"#16a34a",fontSize:"14px"}}>৳{order.totalAmount.toLocaleString()}</p>
                    <span style={{fontSize:"11px",padding:"2px 8px",borderRadius:"99px",background:order.status==="pending"?"#fef3c7":order.status==="confirmed"?"#dbeafe":order.status==="delivered"?"#dcfce7":"#f3f4f6",color:order.status==="pending"?"#92400e":order.status==="confirmed"?"#1e40af":order.status==="delivered"?"#15803d":"#374151"}}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "products" && (
          <div>
            <div style={{display:"flex",gap:"12px",marginBottom:"16px",flexWrap:"wrap"}}>
              <div style={{position:"relative",flex:1,minWidth:"200px"}}>
                <Search size={16} style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"#9ca3af"}} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." style={{width:"100%",paddingLeft:"40px",paddingRight:"16px",paddingTop:"10px",paddingBottom:"10px",borderRadius:"10px",border:"1px solid #e5e7eb",outline:"none",fontSize:"14px",boxSizing:"border-box"}} />
              </div>
              <button onClick={openAddModal} style={{display:"flex",alignItems:"center",gap:"8px",background:"#16a34a",color:"white",border:"none",padding:"10px 20px",borderRadius:"10px",fontWeight:"600",cursor:"pointer",fontSize:"14px",flexShrink:0}}>
                <Plus size={16} />
                Add Product
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px"}}>
              {filteredProducts.map((product) => (
                <div key={product._id} style={{background:"white",borderRadius:"16px",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
                  <div style={{position:"relative",aspectRatio:"1",background:"#f9fafb"}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}} />
                  </div>
                  <div style={{padding:"12px"}}>
                    <span style={{fontSize:"10px",background:"#dcfce7",color:"#15803d",padding:"2px 8px",borderRadius:"99px",fontWeight:"600",textTransform:"capitalize"}}>{product.category}</span>
                    <p style={{margin:"6px 0 2px",fontWeight:"600",fontSize:"13px",color:"#111827",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{product.name}</p>
                    <p style={{margin:"0 0 8px",fontWeight:"700",color:"#16a34a"}}>৳{product.price.toLocaleString()}</p>
                    <div style={{display:"flex",gap:"8px"}}>
                      <button onClick={() => openEditModal(product)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"4px",padding:"6px",borderRadius:"8px",border:"1px solid #e5e7eb",background:"white",cursor:"pointer",fontSize:"12px",color:"#374151"}}>
                        <Pencil size={12} /> Edit
                      </button>
                      <button onClick={() => setDeleteConfirm(product._id)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"4px",padding:"6px",borderRadius:"8px",border:"1px solid #fee2e2",background:"#fef2f2",cursor:"pointer",fontSize:"12px",color:"#ef4444"}}>
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div>
            <h2 style={{margin:"0 0 16px",fontSize:"18px",fontWeight:"700",color:"#111827"}}>All Orders ({orders.length})</h2>
            <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              {orders.map((order) => (
                <div key={order._id} style={{background:"white",borderRadius:"16px",padding:"20px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"12px",marginBottom:"12px"}}>
                    <div>
                      <p style={{margin:"0 0 4px",fontWeight:"700",fontSize:"16px",color:"#111827"}}>#{order.orderNumber}</p>
                      <p style={{margin:"0 0 2px",fontSize:"14px",color:"#374151"}}><strong>{order.customerName}</strong> — {order.phone}</p>
                      <p style={{margin:0,fontSize:"12px",color:"#9ca3af"}}>{order.address}</p>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <p style={{margin:"0 0 4px",fontWeight:"700",color:"#16a34a",fontSize:"18px"}}>৳{order.totalAmount.toLocaleString()}</p>
                      <p style={{margin:0,fontSize:"12px",color:"#9ca3af"}}>{new Date(order.createdAt).toLocaleDateString("en-BD")}</p>
                    </div>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"12px"}}>
                    {order.items.map((item, i) => (
                      <span key={i} style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:"8px",padding:"4px 10px",fontSize:"12px",color:"#374151"}}>
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
                      <span style={{fontSize:"11px",background:"#f3f4f6",padding:"2px 8px",borderRadius:"99px",textTransform:"uppercase",fontWeight:"600"}}>{order.paymentMethod}</span>
                      {order.txnId && <span style={{fontSize:"12px",color:"#6b7280"}}>TxnID: {order.txnId}</span>}
                      {order.paymentScreenshot && (
                        <a href={order.paymentScreenshot} target="_blank" rel="noopener noreferrer" style={{fontSize:"12px",color:"#16a34a",display:"flex",alignItems:"center",gap:"4px"}}>
                          <Eye size={12} /> Screenshot
                        </a>
                      )}
                    </div>
                    <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} style={{fontSize:"12px",border:"1px solid #e5e7eb",borderRadius:"8px",padding:"6px 12px",outline:"none",background:"white"}}>
                      {["pending","confirmed","shipped","delivered","cancelled"].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "categories" && (
          <div style={{display:"flex",flexDirection:"column",gap:"24px"}}>
            <div style={{background:"white",borderRadius:"16px",padding:"24px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <h3 style={{margin:"0 0 16px",fontSize:"16px",fontWeight:"700",color:"#111827",display:"flex",ali
