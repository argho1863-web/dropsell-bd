import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  otp: string,
  name: string
) {
  await transporter.sendMail({
    from: `"DropSell BD" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your DropSell BD account",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'DM Sans', Arial, sans-serif; background: #f0fdf4; margin: 0; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">DropSell BD</h1>
            <p style="color: #bbf7d0; margin: 8px 0 0;">Email Verification</p>
          </div>
          <div style="padding: 32px;">
            <p style="color: #374151; font-size: 16px;">Hello <strong>${name}</strong>,</p>
            <p style="color: #6b7280;">Your One-Time Password (OTP) for account verification:</p>
            <div style="background: #f0fdf4; border: 2px dashed #22c55e; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
              <span style="font-size: 40px; font-weight: 800; color: #16a34a; letter-spacing: 12px;">${otp}</span>
            </div>
            <p style="color: #6b7280; font-size: 14px;">⏱️ This OTP expires in <strong>10 minutes</strong>.</p>
            <p style="color: #6b7280; font-size: 14px;">If you did not request this, please ignore this email.</p>
          </div>
          <div style="background: #f9fafb; padding: 16px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} DropSell BD — Bangladesh's Trusted Marketplace</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
