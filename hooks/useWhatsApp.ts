"use client";

interface WhatsAppOrderPayload {
  orderNumber?: string;
  customerName: string;
  phone: string;
  address: string;
  items: { name: string; price: number; quantity: number }[];
  totalAmount: number;
  deliveryCharge: number;
  paymentMethod: string;
  txnId?: string;
  screenshotUrl?: string;
}

const WA_NUMBER = "8801707776676";

export function useWhatsApp() {
  const openOrder = (payload: WhatsAppOrderPayload): boolean => {
    const itemLines = payload.items
      .map((i) => `  • ${i.name} ×${i.quantity} = ৳${(i.price * i.quantity).toLocaleString()}`)
      .join("\n");

    const paymentLine =
      payload.paymentMethod === "cod"
        ? "💵 Cash on Delivery"
        : `💳 ${payload.paymentMethod.toUpperCase()}${
            payload.txnId ? ` | TxnID: *${payload.txnId}*` : ""
          }${payload.screenshotUrl ? `\n📎 Screenshot: ${payload.screenshotUrl}` : ""}`;

    const message =
      `🛒 *New Order — DropSell BD*\n` +
      `${payload.orderNumber ? `🔖 Order: *${payload.orderNumber}*\n` : ""}` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Customer:* ${payload.customerName}\n` +
      `📞 *Phone:* ${payload.phone}\n` +
      `📍 *Address:* ${payload.address}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🛍️ *Items:*\n${itemLines}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚚 Delivery: ৳${payload.deliveryCharge}\n` +
      `💰 *Total: ৳${payload.totalAmount.toLocaleString()}*\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${paymentLine}`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    const win = window.open(url, "_blank");
    return !!win;
  };

  const openSupport = (message?: string) => {
    const text = message ?? "Hello, I need help with my DropSell BD order.";
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return { openOrder, openSupport };
}
