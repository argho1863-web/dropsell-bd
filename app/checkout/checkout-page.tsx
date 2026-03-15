"use client";
import { useState, useRef } from "react";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";
import {
  User, Phone, MapPin, ChevronRight, CreditCard, Truck,
  Upload, CheckCircle, X, Loader2,
  ShoppingBag, ArrowLeft
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

type PaymentMethod = "cod" | "bkash" | "nagad" | "rocket" | "payment";
type Step = 1 | 2 | 3;

const MOBILE_PAYMENT_OPTIONS = [
  { id: "bkash", label: "bKash", color: "bg-pink-600", textColor: "text-pink-700", bgLight: "bg-pink-50", border: "border-pink-300", qr: "/bkash-qr.png" },
  { id: "nagad", label: "Nagad", color: "bg-orange-500", textColor: "text-orange-700", bgLight: "bg-orange-50", border: "border-orange-300", qr: "/nagad-qr.png" },
  { id: "rocket", label: "Rocket", color: "bg-purple-600", textColor: "text-purple-700", bgLight: "bg-purple-50", border: "border-purple-300", qr: "/rocket-qr.png" },
] as const;

export default function CheckoutPage() {
  const { items, total } = useCart();
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [step, setStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [selectedMobile, setSelectedMobile] = useState<"bkash" | "nagad" | "rocket" | null>(null);
  const [txnId, setTxnId] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const DELIVERY_CHARGE = total >= 999 ? 0 : 80;
  const grandTotal = total + DELIVERY_CHARGE;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="font-display font-bold text-xl text-gray-700 mb-2">Your cart is empty</h2>
          <Link href="/" className="btn-primary inline-flex items-center gap-2 mt-4">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      toast.error("Please enter a valid Bangladesh phone number");
      return;
    }
    setStep(2);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        const interval = setInterval(() => {
          setUploadProgress((p) => Math.min(p + 10, 90));
        }, 200);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: base64, folder: "DropSell/Payments" }),
        });
        clearInterval(interval);
        const data = await res.json();
        if (res.ok) {
          setScreenshotUrl(data.url);
          setUploadProgress(100);
          toast.success("Screenshot uploaded!");
        } else {
          toast.error(data.error || "Upload failed");
          setUploadProgress(0);
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Upload failed");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          address,
          items: items.map((i) => ({
            productId: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          totalAmount: grandTotal,
          paymentMethod: paymentMethod === "cod" ? "cod" : selectedMobile!,
          txnId: txnId || undefined,
          paymentScreenshot: screenshotUrl || undefined,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed");
      router.push(`/order-pending/${orderData.orderNumber}`);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const selectedMobileOption = MOBILE_PAYMENT_OPTIONS.find((o) => o.id === selectedMobile);
  const canPlaceOrder =
    paymentMethod === "cod" ||
    (paymentMethod === "payment" && selectedMobile && txnId && screenshotUrl && !uploading);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to shopping
          </Link>
          <h1 className="font-display font-bold text-2xl text-gray-900">Checkout</h1>

          <div className="flex items-center gap-2 mt-4">
            {[
              { n: 1, label: "Your Details" },
              { n: 2, label: "Payment Type" },
              { n: 3, label: "Confirm" },
            ].map(({ n, label }, i) => (
              <div key={n} className="flex items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > n ? "bg-brand-600 text-white" : step === n ? "bg-brand-600 text-white ring-4 ring-brand-100" : "bg-gray-200 text-gray-400"
                }`}>
                  {step > n ? <CheckCircle className="w-4 h-4" /> : n}
                </div>
                <span className={`text-xs font-medium ${step >= n ? "text-brand-600" : "text-gray-400"}`}>
                  {label}
                </span>
                {i < 2 && <ChevronRight className="w-4 h-4 text-gray-300 mx-1" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-5">

            {/* STEP 1 */}
            <div className={`card p-6 transition-all ${step === 1 ? "ring-2 ring-brand-500" : ""}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-6 h-6 bg-brand-600 text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
                  Delivery Details
                </h2>
                {step > 1 && (
                  <button onClick={() => setStep(1)} className="text-xs text-brand-600 hover:underline">Edit</button>
                )}
              </div>

              {step === 1 ? (
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Full Name" className="input-field pl-10" required />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone: 01XXXXXXXXX" className="input-field pl-10" required />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-4 w-4 h-4 text-gray-400" />
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full Delivery Address (House, Road, Area, District)" className="input-field pl-10 resize-none" rows={3} required />
                  </div>
                  <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                    Continue to Payment
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="text-sm text-gray-600 space-y-1 bg-brand-50 rounded-xl p-3">
                  <p><strong>Name:</strong> {customerName}</p>
                  <p><strong>Phone:</strong> {phone}</p>
                  <p><strong>Address:</strong> {address}</p>
                </div>
              )}
            </div>

            {/* STEP 2 */}
            {step >= 2 && (
              <div className={`card p-6 transition-all ${step === 2 ? "ring-2 ring-brand-500" : ""}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-6 h-6 bg-brand-600 text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
                    Payment Method
                  </h2>
                  {step > 2 && (
                    <button onClick={() => setStep(2)} className="text-xs text-brand-600 hover:underline">Edit</button>
                  )}
                </div>

                {step === 2 ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => { setPaymentMethod("cod"); setStep(3); }}
                      className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-gray-200 rounded-2xl hover:border-brand-400 hover:bg-brand-50 transition-all group"
                    >
                      <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center group-hover:bg-brand-200 transition-colors">
                        <Truck className="w-6 h-6 text-brand-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-gray-800 font-display">Cash on Delivery</p>
                        <p className="text-xs text-gray-400 mt-0.5">Pay when you receive</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { setPaymentMethod("payment"); setStep(3); }}
                      className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-gray-200 rounded-2xl hover:border-brand-400 hover:bg-brand-50 transition-all group"
                    >
                      <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center group-hover:bg-brand-200 transition-colors">
                        <CreditCard className="w-6 h-6 text-brand-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-gray-800 font-display">Payment Now</p>
                        <p className="text-xs text-gray-400 mt-0.5">bKash / Nagad / Rocket</p>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="bg-brand-50 rounded-xl p-3 text-sm text-gray-600">
                    <strong>Method:</strong>{" "}
                    {paymentMethod === "cod" ? "Cash on Delivery" : `Online Payment (${selectedMobile?.toUpperCase() || ""})`}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 — Mobile Payment */}
            {step >= 3 && paymentMethod === "payment" && (
              <div className="card p-6 ring-2 ring-brand-500">
                <h2 className="font-display font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-brand-600 text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>
                  Payment Details
                </h2>

                <div className="grid grid-cols-3 gap-2 mb-5">
                  {MOBILE_PAYMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedMobile(opt.id)}
                      className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all ${
                        selectedMobile === opt.id
                          ? `${opt.border} ${opt.bgLight} ${opt.textColor}`
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <span className={`w-8 h-8 ${opt.color} rounded-xl text-white font-bold text-xs flex items-center justify-center mb-1`}>
                        &#2547;
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>

                {selectedMobile && (
                  <div className="space-y-4">
                    <div className={`${selectedMobileOption?.bgLight} rounded-2xl p-4 text-center border ${selectedMobileOption?.border}`}>
                      <div className="w-40 h-40 mx-auto bg-white rounded-xl flex items-center justify-center border-2 border-gray-100 mb-3 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedMobileOption?.qr}
                          alt={`${selectedMobile} QR`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className={`font-semibold text-sm ${selectedMobileOption?.textColor}`}>
                        Scan to pay <strong>01707776676</strong> and enter details below
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Transaction ID (TxnID) *</label>
                      <input
                        type="text"
                        value={txnId}
                        onChange={(e) => setTxnId(e.target.value)}
                        placeholder={`Enter ${selectedMobile?.toUpperCase()} Transaction ID`}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payment Screenshot *</label>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

                      {!screenshotUrl ? (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="w-full border-2 border-dashed border-gray-300 rounded-xl py-6 text-center hover:border-brand-400 hover:bg-brand-50 transition-all disabled:opacity-50"
                        >
                          {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="w-6 h-6 text-brand-600 animate-spin mx-auto" />
                              <p className="text-sm text-brand-600 font-medium">Uploading... {uploadProgress}%</p>
                              <div className="w-32 h-1.5 bg-gray-200 rounded-full mx-auto">
                                <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                              </div>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm font-semibold text-gray-600">Upload Payment Screenshot</p>
                              <p className="text-xs text-gray-400 mt-0.5">JPG, PNG up to 5MB</p>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-green-700">Screenshot uploaded!</p>
                            <a href={screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline truncate block">
                              View uploaded image
                            </a>
                          </div>
                          <button onClick={() => { setScreenshotUrl(""); setUploadProgress(0); }} className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Place Order Button */}
            {step >= 3 && (
              <button
                onClick={handlePlaceOrder}
                disabled={!canPlaceOrder || placingOrder || (paymentMethod === "payment" && uploading)}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-base py-4"
              >
                {placingOrder ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : paymentMethod === "payment" && uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Waiting for upload...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
            )}

          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="card p-5 sticky top-24">
              <h3 className="font-display font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand-600" />
                Order Summary
              </h3>

              <div className="space-y-3 max-h-56 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-700 truncate text-xs">{item.name}</p>
                      <p className="text-gray-400 text-xs">x{item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-800 text-xs whitespace-nowrap">
                      &#2547;{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>&#2547;{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span className={DELIVERY_CHARGE === 0 ? "text-green-600 font-semibold" : ""}>
                    {DELIVERY_CHARGE === 0 ? "FREE" : `&#2547;${DELIVERY_CHARGE}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
                  <span>Total</span>
                  <span className="text-brand-700">&#2547;{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {DELIVERY_CHARGE > 0 && (
                <p className="text-xs text-center text-gray-400 mt-2 bg-amber-50 rounded-lg p-2">
                  Add &#2547;{(999 - total).toLocaleString()} more for free delivery!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
