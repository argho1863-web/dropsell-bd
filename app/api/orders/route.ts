export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { sendAdminOrderNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { customerName, phone, address, items, totalAmount, paymentMethod, txnId, paymentScreenshot } = body;

    if (!customerName || !phone || !address || !items?.length || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order = await Order.create({
      customerName, phone, address, items,
      totalAmount, paymentMethod, txnId, paymentScreenshot,
      status: "pending",
    });

    // Send email notification to admin
    try {
      await sendAdminOrderNotification({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        phone: order.phone,
        address: order.address,
        items: order.items,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        txnId: order.txnId,
        paymentScreenshot: order.paymentScreenshot,
        _id: order._id.toString(),
      });
    } catch (emailErr) {
      console.error("Admin email failed:", emailErr);
      // Don't fail the order if email fails
    }

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("Order create error:", err);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
        }
