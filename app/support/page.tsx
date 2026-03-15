"use client";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";

export default function SupportPage() {
  const { clearCart } = useCart();
  const router = useRouter();

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",background:"#f0fdf4"}}>
      <div style={{maxWidth:"480px",width:"100%",textAlign:"center"}}>
        <div style={{fontSize:"64px",marginBottom:"16px"}}>✅</div>
        <h1 style={{fontSize:"28px",fontWeight:"800",color:"#111827",marginBottom:"8px"}}>Order Placed!</h1>
        <p style={{color:"#16a34a",fontWeight:"600",marginBottom:"24px"}}>You will be notified once your order is approved.</p>
        <div style={{background:"white",borderRadius:"20px",padding:"24px",boxShadow:"0 4px 20px rgba(0,0,0,0.08)",marginBottom:"16px",textAlign:"left"}}>
          <p style={{color:"#92400e",fontSize:"14px",background:"#fefce8",padding:"12px",borderRadius:"10px",marginBottom:"16px"}}>
            If the product is not delivered, contact us on WhatsApp or Email.
          </p>
          <a href="https://wa.me/8801707776676" target="_blank" rel="noopener noreferrer" style={{display:"block",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"12px",padding:"14px",marginBottom:"10px",textDecoration:"none",color:"#15803d",fontWeight:"700"}}>
            WhatsApp: 01707776676
          </a>
          <a href="mailto:arghoroy339@gmail.com" style={{display:"block",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"12px",padding:"14px",textDecoration:"none",color:"#1d4ed8",fontWeight:"700"}}>
            arghoroy339@gmail.com
          </a>
        </div>
        <button
          onClick={() => { clearCart(); router.push("/"); }}
          style={{width:"100%",background:"#16a34a",color:"white",fontWeight:"700",fontSize:"16px",padding:"16px",borderRadius:"14px",border:"none",cursor:"pointer"}}
        >
          OK — Continue Shopping
        </button>
        <p style={{fontSize:"12px",color:"#9ca3af",marginTop:"10px"}}>Clicking OK clears your cart and goes to home page.</p>
      </div>
    </div>
  );
          }
