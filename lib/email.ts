import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, otp: string, name: string) {
  await transporter.sendMail({
    from: `"Probaho" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your Probaho account",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background: #f0fdf4; margin: 0; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Probaho</h1>
            <p style="color: #bbf7d0; margin: 8px 0 0;">Email Verification</p>
          </div>
          <div style="padding: 32px;">
            <p style="color: #374151;">Hello <strong>${name}</strong>,</p>
            <p style="color: #6b7280;">Your One-Time Password (OTP):</p>
            <div style="background: #f0fdf4; border: 2px dashed #22c55e; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
              <span style="font-size: 40px; font-weight: 800; color: #16a34a; letter-spacing: 12px;">${otp}</span>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Valid for 10 minutes.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendAdminOrderNotification(order: {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  items: { name: string; price: number; quantity: number }[];
  totalAmount: number;
  paymentMethod: string;
  txnId?: string;
  paymentScreenshot?: string;
  _id: string;
}) {
  const baseUrl = process.env.NEXTAUTH_URL || "https://dropsell-bd.vercel.app";

  const itemRows = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${i.name}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center;">x${i.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">&#2547;${(i.price * i.quantity).toLocaleString()}</td>
        </tr>`
    )
    .join("");

  await transporter.sendMail({
    from: `"Probaho Orders" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Order #${order.orderNumber} — Action Required`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background: #f9fafb; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Order Received!</h1>
            <p style="color: #bbf7d0; margin: 8px 0 0; font-size: 18px; font-weight: bold;">Order #${order.orderNumber}</p>
          </div>
          <div style="padding: 24px;">
            <h3 style="color: #111827; margin-top: 0;">Customer Details</h3>
            <table style="width:100%;font-size:14px;">
              <tr><td style="color:#6b7280;padding:4px 0;">Name</td><td style="font-weight:600;">${order.customerName}</td></tr>
              <tr><td style="color:#6b7280;padding:4px 0;">Phone</td><td style="font-weight:600;">${order.phone}</td></tr>
              <tr><td style="color:#6b7280;padding:4px 0;">Address</td><td style="font-weight:600;">${order.address}</td></tr>
            </table>
            <h3 style="color:#111827;margin-top:20px;">Order Items</h3>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr style="background:#f0fdf4;">
                <th style="padding:8px;text-align:left;">Product</th>
                <th style="padding:8px;text-align:center;">Qty</th>
                <th style="padding:8px;text-align:right;">Price</th>
              </tr>
              ${itemRows}
            </table>
            <div style="background:#f0fdf4;border-radius:8px;padding:12px;margin-top:16px;">
              <p style="margin:4px 0;font-size:14px;"><strong>Payment:</strong> ${order.paymentMethod.toUpperCase()}</p>
              ${order.txnId ? `<p style="margin:4px 0;font-size:14px;"><strong>TxnID:</strong> ${order.txnId}</p>` : ""}
              ${order.paymentScreenshot ? `<p style="margin:4px 0;font-size:14px;"><strong>Screenshot:</strong> <a href="${order.paymentScreenshot}" style="color:#16a34a;">View Payment Proof</a></p>` : ""}
              <p style="margin:8px 0 0;font-size:18px;font-weight:bold;color:#16a34a;">Total: &#2547;${order.totalAmount.toLocaleString()}</p>
            </div>
            <h3 style="color:#111827;margin-top:24px;">Take Action</h3>
            <div style="display:flex;gap:12px;margin-top:12px;">
              <a href="${baseUrl}/api/orders/${order._id}/approve?secret=${process.env.ADMIN_ACTION_SECRET || "dropsell-secret-2025"}"
                style="flex:1;background:#16a34a;color:white;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px;text-align:center;display:block;">
                APPROVE ORDER
              </a>
              <a href="${baseUrl}/api/orders/${order._id}/cancel?secret=${process.env.ADMIN_ACTION_SECRET || "dropsell-secret-2025"}"
                style="flex:1;background:#ef4444;color:white;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px;text-align:center;display:block;">
                CANCEL ORDER
              </a>
            </div>
            <p style="color:#9ca3af;font-size:12px;margin-top:24px;text-align:center;">
              Manage orders at <a href="${baseUrl}/admin-dashboard" style="color:#16a34a;">${baseUrl}/admin-dashboard</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
                }
