export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const category = await Category.findById(params.id);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Find all products in this category
    const products = await Product.find({ category: category.slug });

    // Delete each product image from Cloudinary
    for (const product of products) {
      if (product.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(product.cloudinaryId);
        } catch (e) {
          console.error("Cloudinary delete error:", e);
        }
      }
    }

    // Delete all products in this category from DB
    const deletedProducts = await Product.deleteMany({ category: category.slug });

    // Delete the category itself
    await Category.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: `Category deleted along with ${deletedProducts.deletedCount} products`,
      deletedProducts: deletedProducts.deletedCount,
    });
  } catch (err) {
    console.error("Delete category error:", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
                                                     }
