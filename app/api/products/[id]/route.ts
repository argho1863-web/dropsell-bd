import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const body = await req.json();
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const product = await Product.findById(params.id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // Delete from Cloudinary
    if (product.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(product.cloudinaryId);
      } catch (e) {
        console.error("Cloudinary delete error:", e);
      }
    }

    await Product.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Product deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
