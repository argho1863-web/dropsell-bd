# DropSell BD — QR Code & Payment Setup

## QR Code Images
Place these files in the `/public` directory:
- `bkash-qr.png`  → bKash payment QR code (send to 01707776676)
- `nagad-qr.png`  → Nagad payment QR code
- `rocket-qr.png` → Rocket payment QR code

Download your QR codes from your bKash/Nagad/Rocket merchant accounts.

## Environment Variables
Copy `.env.example` to `.env.local` and fill in all values.

## Required for Production:
1. MongoDB Atlas URI
2. Google OAuth credentials (from Google Cloud Console)
3. Cloudinary API secret
4. Gmail App Password (for OTP emails)
5. NextAuth secret: `openssl rand -base64 32`

## Deployment (Vercel)
1. Push to GitHub
2. Import project in Vercel
3. Add all env vars in Vercel dashboard
4. Deploy!
