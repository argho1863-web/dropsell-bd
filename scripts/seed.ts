/**
 * Seed Script — Run with: npx tsx scripts/seed.ts
 * Populates MongoDB with sample products for testing.
 * 
 * Requirements:
 *   npm install -D tsx
 *   Set MONGODB_URI in .env.local
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set in .env.local");

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  description: String,
  image: String,
  cloudinaryId: String,
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const SAMPLE_PRODUCTS = [
  {
    name: "Wireless Bluetooth Earbuds Pro",
    price: 1299,
    category: "electronics",
    description: "Premium sound quality with 30-hour battery life and active noise cancellation. IPX5 waterproof.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
  },
  {
    name: "Men's Premium Cotton T-Shirt",
    price: 599,
    category: "fashion",
    description: "100% organic cotton, breathable fabric. Perfect for Bangladesh's tropical climate.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
  },
  {
    name: "Smart LED Table Lamp",
    price: 849,
    category: "home",
    description: "Touch-sensitive dimmer, 3 color temperatures, USB charging port. Energy efficient LED.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
  },
  {
    name: "Face Wash Brightening Gel",
    price: 349,
    category: "beauty",
    description: "Gentle formula with vitamin C and niacinamide. Suitable for all skin types.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80",
  },
  {
    name: "Yoga Mat Anti-Slip",
    price: 699,
    category: "sports",
    description: "6mm thick premium TPE material, extra-wide 72 inch mat. Includes carry strap.",
    image: "https://images.unsplash.com/photo-1601925228988-9e65a23d5fd5?w=500&q=80",
  },
  {
    name: "USB-C Fast Charging Cable",
    price: 249,
    category: "electronics",
    description: "65W fast charging, 2-meter braided nylon cable. Compatible with all USB-C devices.",
    image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500&q=80",
  },
  {
    name: "Women's Casual Kurti",
    price: 799,
    category: "fashion",
    description: "Traditional embroidery with modern cut. Machine washable, available in 5 colors.",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&q=80",
  },
  {
    name: "Stainless Steel Water Bottle 1L",
    price: 449,
    category: "home",
    description: "Double-wall vacuum insulated. Keeps hot 12h, cold 24h. BPA-free, leak-proof lid.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
  },
  {
    name: "Mechanical Gaming Keyboard",
    price: 2499,
    category: "electronics",
    description: "Blue switch, RGB backlight, anti-ghosting keys. USB plug & play.",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&q=80",
  },
  {
    name: "Sunscreen SPF 50+ Lotion",
    price: 299,
    category: "beauty",
    description: "Lightweight, non-greasy formula. PA++++ UVA/UVB protection. 100ml.",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=80",
  },
  {
    name: "Backpack Waterproof 30L",
    price: 1199,
    category: "sports",
    description: "Oxford fabric with rain cover included. Padded laptop compartment, 7 pockets.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
  },
  {
    name: "Non-Stick Frying Pan Set",
    price: 1599,
    category: "home",
    description: "3-piece ceramic coated set (20cm, 26cm, 30cm). Oven safe to 200°C.",
    image: "https://images.unsplash.com/photo-1584990347449-a2d4c2c97e2e?w=500&q=80",
  },
];

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected!");

  console.log("🗑️  Clearing existing products...");
  await Product.deleteMany({});

  console.log("📦 Seeding products...");
  const inserted = await Product.insertMany(SAMPLE_PRODUCTS);
  console.log(`✅ Inserted ${inserted.length} products successfully!`);

  await mongoose.disconnect();
  console.log("🎉 Seeding complete!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
