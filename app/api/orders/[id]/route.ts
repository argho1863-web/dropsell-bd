export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    await dbConnect();
    const { status } = await req.json();
    const order = await Order.findByIdAndUpdate(params.id, { status }, { new: true });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
