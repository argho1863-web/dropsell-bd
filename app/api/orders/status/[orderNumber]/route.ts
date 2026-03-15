export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(req: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    await dbConnect();
    const order = await Order.findOne({ orderNumber: params.orderNumber });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({
      status: order.status,
      paymentMethod: order.paymentMethod,
      orderNumber: order.orderNumber,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
