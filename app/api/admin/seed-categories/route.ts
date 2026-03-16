export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

const DEFAULT_CATEGORIES = [
  { name: "Electronics", slug: "electronics" },
  { name: "Fashion", slug: "fashion" },
  { name: "Home", slug: "home" },
  { name: "Beauty", slug: "beauty" },
  { name: "Sports", slug: "sports" },
  { name: "Books", slug: "books" },
  { name: "Other", slug: "other" },
];

export async function GET(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get("secret");
    if (secret !== (process.env.ADMIN_ACTION_SECRET || "dropsell-secret-2025")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    for (const cat of DEFAULT_CATEGORIES) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (!existing) {
        await Category.create(cat);
      }
    }

    return NextResponse.json({ message: "Default categories seeded successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to seed categories" }, { status: 500 });
  }
                                              }
