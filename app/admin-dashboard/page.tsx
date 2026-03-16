"use client";
import{useState,useEffect,useRef}from"react";
import{useSession}from"next-auth/react";
import{useRouter}from"next/navigation";
import{Plus,Pencil,Trash2,X,Upload,Loader2,CheckCircle,Eye,Search,LayoutDashboard,RefreshCw,AlertTriangle,Tag}from"lucide-react";
import toast from"react-hot-toast";
interface Product{_id:string;name:string;price:number;category:string;description:string;image:string;}
interface Order{_id:string;orderNumber:string;customerName:string;phone:string;address:string;items:{name:string;price:number;quantity:number}[];totalAmount:number;paymentMethod:string;txnId?:string;paymentScreenshot?:string;status:string;createdAt:string;}
interface Category{_id:string;name:string;slug:string;}
type Tab="dashboard"|"products"|"orders"|"categories";
export default function AdminDashboard(){
const{data:session,status}=useSession();
const router=useRouter();
const[tab,setTab]=useState<Tab>("dashboard");
const[products,setProducts]=useState<Product[]>([]);
const[orders,setOrders]=useState<Order[]>([]);
const[categories,setCategories]=useState<Category[]>([]);
const[loading,setLoading]=useState(true);
const[showModal,setShowModal]=useState(false);
const[editingProduct,setEditingProduct]=useState<Product|null>(null);
const[deleteConfirm,setDeleteConfirm]=useState<string|null>(null);
const[deleteCatConfirm,setDeleteCatConfirm]=useState<Category|null>(null);
const[search,setSearch]=useState("");
const[newCat,setNewCat]=useState("");
const[addingCat,setAddingCat]=useState(false);
const[deletingCat,setDeletingCat]=useState(false);
const[pName,setPName]=useState("");
const[pPrice,setPPrice]=useState("");
const[pCat,setPCat]=useState("");
const[pDesc,setPDesc]=useState("");
const[pImg,setPImg]=useState("");
const[pCloudId,setPCloudId]=useState("");
const[imgUp,setImgUp]=useState(false);
const[saving,setSaving]=useState(false);
const imgRef=useRef<HTMLInputElement>(null);
useEffect(()=>{
if(status==="loading")return;
if(!(session?.user as any)?.isAdmin){router.push("/");return;}
fetchAll();
// eslint-disable-next-line react-hooks/exhaustive-deps
},[session,status]);
const fetchAll=async()=>{
setLoading(true);
try{
const[pr,or,cr]=await Promise.all([fetch("/api/products"),fetch("/api/orders"),fetch("/api/categories")]);
const[p,o,c]=await Promise.all([pr.json(),or.json(),cr.json()]);
setProducts(Array.isArray(p)?p:[]);
setOrders(Array.isArray(o)?o:[]);
setCategories(Array.isArray(c)?c:[]);
}catch{toast.error("Failed to load");}
finally{setLoading(false);}
};
const openAdd=()=>{setEditingProduct(null);setPName("");setPPrice("");setPCat(categories[0]?.slug||"");setPDesc("");setPImg("");setPCloudId("");setShowModal(true);};
const openEdit=(p:Product)=>{setEditingProduct(p);setPName(p.name);setPPrice(String(p.price));setPCat(p.category);setPDesc(p.description);setPImg(p.image);setPCloudId("");setShowModal(true);};
const handleImgUpload=async(e:React.ChangeEvent<HTMLInputElement>)=>{
const file=e.target.files?.[0];
if(!file)return;
setImgUp(true);
const reader=new FileReader();
reader.onload=async(ev)=>{
const base64=ev.target?.result as string;
const res=await fetch("/api/upload",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({data:base64,folder:"DropSell"})});
const data=await res.json();
if(res.ok){setPImg(data.url);setPCloudId(data.public_id);toast.success("Uploaded!");}
else toast.error(data.error||"Failed");
setImgUp(false);
};
reader.readAsDataURL(file);
};
const handleSave=async(e:React.FormEvent)=>{
e.preventDefault();
if(!pName||!pPrice||!pCat||!pDesc||!pImg){toast.error("All fields required");return;}
setSaving(true);
const res=await fetch(editingProduct?`/api/products/${editingProduct._id}`:"/api/products",{method:editingProduct?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:pName,price:Number(pPrice),category:pCat,description:pDesc,image:pImg,cloudinaryId:pCloudId})});
if(res.ok){toast.success(editingProduct?"Updated!":"Added!");setShowModal(false);fetchAll();}
else toast.error("Failed");
setSaving(false);
};
const handleDelProd=async(id:string)=>{
const res=await fetch(`/api/products/${id}`,{method:"DELETE"});
if(res.ok){toast.success("Deleted");setDeleteConfirm(null);fetchAll();}
else toast.error("Failed");
};
const handleAddCat=async(e:React.FormEvent)=>{
e.preventDefault();
if(!newCat.trim())return;
setAddingCat(true);
const res=await fetch("/api/categories",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:newCat.trim()})});
const data=await res.json();
if(res.ok){toast.success("Category added!");setNewCat("");fetchAll();}
else toast.error(data.error||"Failed");
setAddingCat(false);
};
const handleDelCat=async()=>{
if(!deleteCatConfirm)return;
setDeletingCat(true);
const res=await fetch(`/api/categories/${deleteCatConfirm._id}`,{method:"DELETE"});
const data=await res.json();
if(res.ok){toast.success(data.message||"Deleted!");setDeleteCatConfirm(null);fetchAll();}
else toast.error(data.error||"Failed");
setDeletingCat(false);
};
const handleStatus=async(id:string,s:string)=>{
const res=await fetch(`/api/orders/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:s})});
if(res.ok){toast.success("Updated");fetchAll();}
};
if(status==="loading"||loading)return(
<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
<p style={{color:"#16a34a",fontWeight:"600",fontSize:"18px"}}>Loading admin panel...</p>
</div>
);
const rev=orders.filter(o=>o.status!=="cancelled").reduce((s,o)=>s+o.totalAmount,0);
const pending=orders.filter(o=>o.status==="pending").length;
const filtered=products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));
return(
<div style={{minHeight:"100vh",background:"#f9fafb"}}>
<div style={{background:"#111827",color:"white",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
<div style={{display:"flex",alignItems:"center",gap:"12px"}}>
<LayoutDashboard size={20} color="#16a34a"/>
<span style={{fontWeight:"700",fontSize:"16px"}}>Admin Dashboard — Probaho</span>
</div>
<button onClick={fetchAll} style={{background:"none",border:"none",color:"#9ca3af",cursor:"pointer",padding:"8px"}}>
<RefreshCw size={16}/>
</button>
</div>
<div style={{maxWidth:"1200px",margin:"0 auto",padding:"24px 16px"}}>
<div style={{display:"flex",gap:"4px",background:"white",border:"1px solid #e5e7eb",borderRadius:"16px",padding:"4px",marginBottom:"24px",width:"fit-content",overflowX:"auto"}}>
{(["dashboard","products","orders","categories"] as Tab[]).map(t=>(
<button key={t} onClick={()=>setTab(t)} style={{padding:"10px 16px",borderRadius:"12px",fontSize:"13px",fontWeight:"600",border:"none",cursor:"pointer",background:tab===t?"#16a34a":"transparent",color:tab===t?"white":"#6b7280",whiteSpace:"nowrap",textTransform:"capitalize"}}>
{t}
</button>
))}
</div>
{tab==="dashboard"&&(
<div>
<div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"16px",marginBottom:"24px"}}>
{[{l:"Products",v:products.length},{l:"Orders",v:orders.length},{l:"Pending",v:pending},{l:"Revenue",v:`৳${rev.toLocaleString()}`}].map(({l,v})=>(
<div key={l} style={{background:"white",borderRadius:"16px",padding:"20px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
<p style={{margin:"0 0 8px",fontSize:"12px",color:"#6b7280"}}>{l}</p>
<p style={{margin:0,fontSize:"24px",fontWeight:"800",color:"#111827"}}>{v}</p>
</div>
))}
</div>
<div style={{background:"white",borderRadius:"16px",padding:"24px"}}>
<h3 style={{margin:"0 0 16px",fontWeight:"700",color:"#111827"}}>Recent Orders</h3>
{orders.slice(0,5).map(o=>(
<div key={o._id} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #f9fafb"}}>
<div>
<p style={{margin:0,fontWeight:"600",fontSize:"14px"}}>#{o.orderNumber}</p>
<p style={{margin:0,fontSize:"12px",color:"#9ca3af"}}>{o.customerName} — {o.phone}</p>
</div>
<div style={{textAlign:"right"}}>
<p style={{margin:0,fontWeight:"700",color:"#16a34a"}}>৳{o.totalAmount.toLocaleString()}</p>
<span style={{fontSize:"11px",color:"#6b7280"}}>{o.status}</span>
</div>
</div>
))}
</div>
</div>
)}
{tab==="products"&&(
<div>
<div style={{display:"flex",gap:"12px",marginBottom:"16px",flexWrap:"wrap"}}>
<div style={{position:"relative",flex:1,minWidth:"200px"}}>
<Search size={16} style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"#9ca3af"}}/>
<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." style={{width:"100%",paddingLeft:"40px",paddingRight:"16px",paddingTop:"10px",paddingBottom:"10px",borderRadius:"10px",border:"1px solid #e5e7eb",outline:"none",fontSize:"14px",boxSizing:"border-box"}}/>
</div>
<button onClick={openAdd} style={{display:"flex",alignItems:"center",gap:"8px",background:"#16a34a",color:"white",border:"none",padding:"10px 20px",borderRadius:"10px",fontWeight:"600",cursor:"pointer",fontSize:"14px",flexShrink:0}}>
<Plus size={16}/>Add Product
</button>
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px"}}>
{filtered.map(p=>(
<div key={p._id} style={{background:"white",borderRadius:"16px",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
<div style={{aspectRatio:"1",background:"#f9fafb",overflow:"hidden"}}>
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
</div>
<div style={{padding:"12px"}}>
<span style={{fontSize:"10px",background:"#dcfce7",color:"#15803d",padding:"2px 8px",borderRadius:"99px",fontWeight:"600",textTransform:"capitalize"}}>{p.category}</span>
<p style={{margin:"6px 0 2px",fontWeight:"600",fontSize:"13px",color:"#111827",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</p>
<p style={{margin:"0 0 8px",fontWeight:"700",color:"#16a34a"}}>৳{p.price.toLocaleString()}</p>
<div style={{display:"flex",gap:"8px"}}>
<button onClick={()=>openEdit(p)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"4px",padding:"6px",borderRadius:"8px",border:"1px solid #e5e7eb",background:"white",cursor:"pointer",fontSize:"12px",color:"#374151"}}>
<Pencil size={12}/>Edit
</button>
<button onClick={()=>setDeleteConfirm(p._id)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"4px",padding:"6px",borderRadius:"8px",border:"1px solid #fee2e2",background:"#fef2f2",cursor:"pointer",fontSize:"12px",color:"#ef4444"}}>
<Trash2 size={12}/>Delete
</button>
</div>
</div>
</div>
))}
</div>
</div>
)}
{tab==="orders"&&(
<div>
<h2 style={{margin:"0 0 16px",fontSize:"18px",fontWeight:"700",color:"#111827"}}>All Orders ({orders.length})</h2>
<div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
{orders.map(o=>(
<div key={o._id} style={{background:"white",borderRadius:"16px",padding:"20px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
<div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"12px",marginBottom:"12px"}}>
<div>
<p style={{margin:"0 0 4px",fontWeight:"700",fontSize:"16px",color:"#111827"}}>#{o.orderNumber}</p>
<p style={{margin:"0 0 2px",fontSize:"14px",color:"#374151"}}>{o.customerName} — {o.phone}</p>
<p style={{margin:0,fontSize:"12px",color:"#9ca3af"}}>{o.address}</p>
</div>
<div style={{textAlign:"right"}}>
<p style={{margin:"0 0 4px",fontWeight:"700",color:"#16a34a",fontSize:"18px"}}>৳{o.totalAmount.toLocaleString()}</p>
<p style={{margin:0,fontSize:"12px",color:"#9ca3af"}}>{new Date(o.createdAt).toLocaleDateString("en-BD")}</p>
</div>
</div>
<div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"12px"}}>
{o.items.map((item,i)=>(
<span key={i} style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:"8px",padding:"4px 10px",fontSize:"12px",color:"#374151"}}>
{item.name} x{item.quantity}
</span>
))}
</div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
<div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
<span style={{fontSize:"11px",background:"#f3f4f6",padding:"2px 8px",borderRadius:"99px",textTransform:"uppercase",fontWeight:"600"}}>{o.paymentMethod}</span>
{o.txnId&&<span style={{fontSize:"12px",color:"#6b7280"}}>TxnID: {o.txnId}</span>}
{o.paymentScreenshot&&(
<a href={o.paymentScreenshot} target="_blank" rel="noopener noreferrer" style={{fontSize:"12px",color:"#16a34a",display:"flex",alignItems:"center",gap:"4px"}}>
<Eye size={12}/>Screenshot
</a>
)}
</div>
<select value={o.status} onChange={e=>handleStatus(o._id,e.target.value)} style={{fontSize:"12px",border:"1px solid #e5e7eb",borderRadius:"8px",padding:"6px 12px",outline:"none",background:"white"}}>
{["pending","confirmed","shipped","delivered","cancelled"].map(s=>(
<option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
))}
</select>
</div>
</div>
))}
</div>
</div>
)}
{tab==="categories"&&(
<div style={{display:"flex",flexDirection:"column",gap:"24px"}}>
<div style={{background:"white",borderRadius:"16px",padding:"24px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
<h3 style={{margin:"0 0 16px",fontSize:"16px",fontWeight:"700",color:"#111827"}}>Add New Category</h3>
<form onSubmit={handleAddCat} style={{display:"flex",gap:"12px"}}>
<input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="e.g. Toys, Food, Furniture" style={{flex:1,padding:"10px 16px",borderRadius:"10px",border:"1px solid #e5e7eb",outline:"none",fontSize:"14px"}} required/>
<button type="submit" disabled={addingCat||!newCat.trim()} style={{display:"flex",alignItems:"center",gap:"8px",background:"#16a34a",color:"white",border:"none",padding:"10px 20px",borderRadius:"10px",fontWeight:"600",cursor:"pointer",fontSize:"14px",flexShrink:0}}>
{addingCat?<Loader2 size={16}/>:<Plus size={16}/>}Add
</button>
</form>
</div>
<div style={{background:"white",borderRadius:"16px",padding:"24px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
<h3 style={{margin:"0 0 16px",fontSize:"16px",fontWeight:"700",color:"#111827"}}>All Categories ({categories.length})</h3>
{categories.length===0?(
<div style={{textAlign:"center",padding:"40px"}}>
<Tag size={48} color="#e5e7eb" style={{margin:"0 auto 12px",display:"block"}}/>
<p style={{color:"#9ca3af"}}>No categories. Add one above.</p>
</div>
):(
<div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px"}}>
{categories.map(cat=>{
const count=products.filter(p=>p.category===cat.slug).length;
return(
<div key={cat._id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px",background:"#f9fafb",borderRadius:"12px",border:"1px solid #e5e7eb"}}>
<div>
<p style={{margin:"0 0 2px",fontWeight:"600",color:"#111827",textTransform:"capitalize"}}>{cat.name}</p>
<p style={{margin:0,fontSize:"12px",color:"#9ca3af"}}>{count} product{count!==1?"s":""}</p>
</div>
<button onClick={()=>setDeleteCatConfirm(cat)} style={{width:"32px",height:"32px",borderRadius:"8px",background:"#fee2e2",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
<Trash2 size={14} color="#ef4444"/>
</button>
</div>
);
})}
</div>
)}
</div>
<div style={{background:"#f0fdf4",borderRadius:"16px",padding:"20px",border:"1px solid #bbf7d0"}}>
<p style={{margin:"0 0 12px",fontSize:"14px",color:"#15803d",fontWeight:"600"}}>First time? Seed default categories:</p>
<a href="/api/admin/seed-categories?secret=dropsell-secret-2025" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:"8px",background:"#16a34a",color:"white",padding:"10px 20px",borderRadius:"10px",textDecoration:"none",fontWeight:"600",fontSize:"14px"}}>
<CheckCircle size={16}/>Seed Default Categories
</a>
</div>
</div>
)}
</div>
{showModal&&(
<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",background:"rgba(0,0,0,0.5)",overflowY:"auto"}}>
<div style={{background:"white",borderRadius:"24px",padding:"32px",width:"100%",maxWidth:"500px",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"}}>
<h2 style={{margin:0,fontSize:"20px",fontWeight:"700",color:"#111827"}}>{editingProduct?"Edit Product":"Add New Product"}</h2>
<button onClick={()=>setShowModal(false)} style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af"}}>
<X size={20}/>
</button>
</div>
<form onSubmit={handleSave} style={{display:"flex",flexDirection:"column",gap:"16px"}}>
<div>
<label style={{display:"block",fontSize:"12px",fontWeight:"600",color:"#374151",marginBottom:"6px"}}>Product Image *</label>
<input ref={imgRef} type="file" accept="image/*" onChange={handleImgUpload} style={{display:"none"}}/>
{pImg?(
<div style={{position:"relative",width:"100%",height:"160px",borderRadius:"12px",overflow:"hidden",border:"2px solid #16a34a"}}>
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={pImg} alt="Preview" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
<button type="button" onClick={()=>{setPImg("");setPCloudId("");}} style={{position:"absolute",top:"8px",right:"8px",width:"28px",height:"28px",background:"#ef4444",color:"white",border:"none",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
<X size={14}/>
</button>
</div>
):(
<button type="button" onClick={()=>imgRef.current?.click()} disabled={imgUp} style={{width:"100%",border:"2px dashed #d1d5db",borderRadius:"12px",padding:"32px",textAlign:"center",background:"#f9fafb",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"8px"}}>
{imgUp?<Loader2 size={24} color="#16a34a"/>:<Upload size={24} color="#9ca3af"/>}
<span style={{fontSize:"14px",color:"#6b7280"}}>{imgUp?"Uploading...":"Click to upload image"}</span>
</button>
)}
</div>
<div>
<label style={{display:"block",fontSize:"12px",fontWeight:"600",color:"#374151",marginBottom:"6px"}}>Product Name *</label>
<input type="text" value={pName} onChange={e=>setPName(e.target.value)} placeholder="e.g. Wireless Earbuds Pro" style={{width:"100%",padding:"10px 16px",borderRadius:"10px",border:"1px solid #e5e7eb",outline:"none",fontSize:"14px",boxSizing:"border-box"}} required/>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
<div>
<label style={{display:"block",fontSize:"12px",fontWeight:"600",color:"#374151",marginBottom:"6px"}}>Price (BDT) *</label>
<input type="number" value={pPrice} onChange={e=>setPPrice(e.target.value)} placeholder="1499" style={{width:"100%",padding:"10px 16px",borderRadius:"10px",border:"1px solid #e5e7eb",outline:"none",fontSize:"14px",boxSizing:"border-box"}} min="1" required/>
</div>
<div>
<label style={{display:"block",fontSize:"12px",fontWeight:"600",color:"#374151",marginBottom:"6px"}}>Category *</label>
<select value={pCat} onChange={e=>setPCat(e.target.value)} style={{width:"100%",padding:"10px 16px",borderRadius:"10px",border:"1px solid #e5e7eb",outline:"none",fontSize:"14px",boxSizing:"border-box",background:"white"}}>
{categories.map(c=>(<option key={c._id} value={c.slug}>{c.name}</option>))}
</select>
</div>
</div>
<div>
<label style={{display:"block",fontSize:"12px",fontWeight:"600",color:"#374151",marginBottom:"6px"}}>Description *</label>
<textarea value={pDesc} onChange={e=>setPDesc(e.target.value)} placeholder="Product description..." style={{width:"100%",padding:"10px 16px",borderRadius:"10px",border:"1px solid #e5e7eb",outline:"none",fontSize:"14px",resize:"none",boxSizing:"border-box"}} rows={3} required/>
</div>
<div style={{display:"flex",gap:"12px",paddingTop:"8px"}}>
<button type="button" onClick={()=>setShowModal(false)} style={{flex:1,padding:"12px",borderRadius:"10px",border:"2px solid #16a34a",color:"#16a34a",background:"white",fontWeight:"600",cursor:"pointer",fontSize:"14px"}}>Cancel</button>
<button type="submit" disabled={saving||imgUp} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",padding:"12px",borderRadius:"10px",border:"none",background:"#16a34a",color:"white",fontWeight:"600",cursor:"pointer",fontSize:"14px"}}>
{saving?<Loader2 size={16}/>:<CheckCircle size={16}/>}
{saving?"Saving...":editingProduct?"Update":"Add Product"}
</button>
</div>
</form>
</div>
</div>
)}
{deleteConfirm&&(
<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",background:"rgba(0,0,0,0.5)"}}>
<div style={{background:"white",borderRadius:"24px",padding:"32px",width:"100%",maxWidth:"380px",textAlign:"center"}}>
<AlertTriangle size={40} color="#ef4444" style={{margin:"0 auto 16px",display:"block"}}/>
<h3 style={{margin:"0 0 8px",fontSize:"20px",fontWeight:"700",color:"#111827"}}>Delete Product?</h3>
<p style={{margin:"0 0 24px",fontSize:"14px",color:"#6b7280"}}>This will permanently delete the product and its image.</p>
<div style={{display:"flex",gap:"12px"}}>
<button onClick={()=>setDeleteConfirm(null)} style={{flex:1,padding:"12px",borderRadius:"10px",border:"2px solid #e5e7eb",background:"white",fontWeight:"600",cursor:"pointer"}}>Cancel</button>
<button onClick={()=>handleDelProd(deleteConfirm)} style={{flex:1,padding:"12px",borderRadius:"10px",border:"none",background:"#ef4444",color:"white",fontWeight:"600",cursor:"pointer"}}>Delete</button>
</div>
</div>
</div>
)}
{deleteCatConfirm&&(
<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",background:"rgba(0,0,0,0.5)"}}>
<div style={{background:"white",borderRadius:"24px",padding:"32px",width:"100%",maxWidth:"380px",textAlign:"center"}}>
<AlertTriangle size={40} color="#ef4444" style={{margin:"0 auto 16px",display:"block"}}/>
<h3 style={{margin:"0 0 8px",fontSize:"20px",fontWeight:"700",color:"#111827"}}>Delete Category?</h3>
<p style={{margin:"0 0 8px",fontSize:"14px",color:"#6b7280"}}>Deleting <strong style={{color:"#ef4444"}}>{deleteCatConfirm.name}</strong></p>
<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"12px",marginBottom:"24px"}}>
<p style={{margin:0,fontSize:"13px",fontWeight:"600",color:"#dc2626"}}>This will also delete ALL {products.filter(p=>p.category===deleteCatConfirm.slug).length} products in this category!</p>
</div>
<div style={{display:"flex",gap:"12px"}}>
<button onClick={()=>setDeleteCatConfirm(null)} style={{flex:1,padding:"12px",borderRadius:"10px",border:"2px solid #e5e7eb",background:"white",fontWeight:"600",cursor:"pointer"}}>Cancel</button>
<button onClick={handleDelCat} disabled={deletingCat} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",padding:"12px",borderRadius:"10px",border:"none",background:"#ef4444",color:"white",fontWeight:"600",cursor:"pointer"}}>
{deletingCat?<Loader2 size={16}/>:null}
{deletingCat?"Deleting...":"Delete All"}
</button>
</div>
</div>
</div>
)}
</div>
);
}
