import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { isValidEmail, isDisposableEmail } from "@/lib/disposable-email";
import { sendVerificationEmail } from "@/lib/email";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (isDisposableEmail(email)) {
      return NextResponse.json(
        { error: "Temporary/disposable emails are not allowed. Please use a real email." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.isVerified) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }
      // Resend OTP for unverified user
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      existing.otp = otp;
      existing.otpExpiry = otpExpiry;
      await existing.save();
      await sendVerificationEmail(email, otp, existing.name);
      return NextResponse.json({ message: "Verification OTP resent to your email" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
      provider: "credentials",
    });

    await sendVerificationEmail(email, otp, name);

    return NextResponse.json(
      { message: "Account created! Please check your email for the OTP." },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
