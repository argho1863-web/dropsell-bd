# 🛍️ DropSell BD — Full-Stack E-Commerce Platform

Bangladesh's trusted online marketplace built with Next.js 14, Tailwind CSS, and MongoDB.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Next.js API Routes |
| Database | MongoDB Atlas |
| Auth | NextAuth.js (Google + Email/Password) |
| Images | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| Deployment | Vercel |

---

## 📁 Project Structure

```
dropsell-bd/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth handler
│   │   ├── auth/signup/           # User registration
│   │   ├── auth/verify-otp/       # Email OTP verification
│   │   ├── products/              # GET all, POST (admin)
│   │   ├── products/[id]/         # PUT, DELETE (admin)
│   │   ├── orders/                # POST create, GET all (admin)
│   │   ├── orders/[id]/           # PATCH status (admin)
│   │   └── upload/                # Cloudinary upload proxy
│   ├── auth/signin/               # Sign-in page
│   ├── auth/signup/               # Sign-up + OTP page
│   ├── checkout/                  # 3-step checkout
│   ├── support/                   # Post-order support page
│   ├── admin-dashboard/           # Admin panel
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home/product listing
│   └── globals.css
├── components/
│   ├── Navbar.tsx                 # Responsive navbar + cart icon
│   ├── Footer.tsx
│   ├── CartContext.tsx            # Global cart state
│   ├── CartDrawer.tsx             # Slide-out cart
│   ├── ProductCard.tsx            # Product grid card
│   ├── AdminPasswordModal.tsx     # Admin password gate
│   └── Providers.tsx              # Session + Cart + Toast
├── lib/
│   ├── mongodb.ts                 # Mongoose connection
│   ├── email.ts                   # Nodemailer helper
│   └── disposable-email.ts       # Disposable email blocker
├── models/
│   ├── User.ts
│   ├── Product.ts
│   └── Order.ts
└── public/
    ├── bkash-qr.png              # ADD THIS
    ├── nagad-qr.png              # ADD THIS
    └── rocket-qr.png             # ADD THIS
```

---

## ⚙️ Setup Instructions

### 1. Install Dependencies
```bash
cd dropsell-bd
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

### 3. Required Environment Variables

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<run: openssl rand -base64 32>

# Google OAuth (console.cloud.google.com)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dgewaqr7w
CLOUDINARY_API_KEY=387743485551751
CLOUDINARY_API_SECRET=<from cloudinary dashboard>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=DropSell

# Gmail SMTP (use App Password, not account password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=arghoroy339@gmail.com
SMTP_PASS=<gmail app password>

# Admin
ADMIN_EMAIL=arghoroy339@gmail.com
ADMIN_PASSWORD=Argho@12345
```

### 4. Add QR Codes
Place these images in `/public`:
- `bkash-qr.png`
- `nagad-qr.png`
- `rocket-qr.png`

### 5. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 🔐 Admin Access

1. Sign in with `arghoroy339@gmail.com` / `Argho@12345`
2. Click the **"Admin"** button in the navbar
3. Re-enter password `Argho@12345`
4. You'll be redirected to `/admin-dashboard`

---

## 🛒 Checkout Flow

1. **Step 1** — Enter Name, Phone, Address
2. **Step 2** — Choose: Cash on Delivery OR Payment Now
3. **Step 3** (if Payment Now) — Select bKash/Nagad/Rocket → Scan QR → Enter TxnID → Upload Screenshot
4. **Place Order** → WhatsApp message opens → Redirect to Support page

---

## 🚀 Deploy to Vercel

```bash
# Push to GitHub first, then:
vercel --prod

# Or import via vercel.com dashboard
# Add all env vars in Vercel → Project → Settings → Environment Variables
```

---

## 📱 Features

- ✅ Google + Email/Password login
- ✅ Email OTP verification (no temp emails allowed)
- ✅ Admin password double-verification
- ✅ Product CRUD with Cloudinary image upload
- ✅ Persistent shopping cart (localStorage)
- ✅ 3-step mobile-optimized checkout
- ✅ bKash/Nagad/Rocket QR code display
- ✅ Payment screenshot upload to Cloudinary
- ✅ WhatsApp order notification
- ✅ Order management in admin panel
- ✅ Mobile-responsive design
- ✅ Green & white brand (Bangladesh-optimized)

---

Made with ❤️ for Bangladesh 🇧🇩
