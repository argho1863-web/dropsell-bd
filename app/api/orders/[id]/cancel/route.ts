export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const secret = req.nextUrl.searchParams.get("secret");
    const validSecret = process.env.ADMIN_ACTION_SECRET || "dropsell-secret-2025";

    if (secret !== validSecret) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const order = await Order.findByIdAndUpdate(
      params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "https://dropsell-bd.vercel.app";
    return NextResponse.redirect(`${baseUrl}/admin-dashboard?cancelled=${order.orderNumber}`);
  } catch (err) {
    return new NextResponse("Server error", { status: 500 });
  }
}
