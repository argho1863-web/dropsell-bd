import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: "Email already verified" });
    }

    // Rate limit: don't resend if last OTP was sent < 60 seconds ago
    if (user.otpExpiry) {
      const tenMinutesAgo = new Date(Date.now() + 9 * 60 * 1000);
      if (user.otpExpiry > tenMinutesAgo) {
        return NextResponse.json(
          { error: "Please wait at least 1 minute before requesting a new OTP." },
          { status: 429 }
        );
      }
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendVerificationEmail(email, otp, user.name);

    return NextResponse.json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error("Resend OTP error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
