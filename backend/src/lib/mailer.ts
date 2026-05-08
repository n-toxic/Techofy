import nodemailer from "nodemailer";
import { logger } from "./logger";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "toxic.bots.hub@gmail.com",
    pass: "ggnt epny yvcg mzfq",
  },
});

const FROM = `"Techofy Cloud" <toxic.bots.hub@gmail.com>`;
const BRAND_COLOR = "#2563EB";
const SITE_URL = process.env.SITE_URL ?? "https://cloud.edev.fun";

function emailTemplate(title: string, greeting: string, body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#f4f6fb;font-family:Inter,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
  <table width="100%" style="max-width:520px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
    <tr><td style="background:${BRAND_COLOR};padding:28px 32px;text-align:center">
      <span style="font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.5px">☁ Techofy Cloud</span>
    </td></tr>
    <tr><td style="padding:36px 32px">
      <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111">${title}</p>
      <p style="margin:0 0 24px;color:#6b7280;font-size:14px">${greeting}</p>
      ${body}
      <p style="margin:32px 0 0;color:#9ca3af;font-size:12px">This email was sent from <a href="${SITE_URL}" style="color:${BRAND_COLOR}">${SITE_URL}</a>. Do not reply to this email.</p>
    </td></tr>
  </table>
  </td></tr></table></body></html>`;
}

export async function sendOtpEmail(email: string, code: string, name: string): Promise<void> {
  const greeting = name ? `Hi ${name},` : "Hello,";
  const body = `
    <p style="color:#374151;font-size:15px;margin:0 0 16px">Your email verification code is:</p>
    <div style="background:#EFF6FF;border:2px dashed ${BRAND_COLOR};border-radius:10px;text-align:center;padding:20px;margin:0 0 20px">
      <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#111">${code}</span>
    </div>
    <p style="color:#6b7280;font-size:13px;margin:0">⏰ This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>`;
  try {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: `${code} — Your Techofy Cloud Verification Code`,
      html: emailTemplate("Verify Your Account", greeting, body),
    });
  } catch (err) {
    logger.warn({ err, email }, "Failed to send OTP email — continuing anyway");
  }
}

export async function sendPasswordResetEmail(email: string, code: string, name: string): Promise<void> {
  const greeting = name ? `Hi ${name},` : "Hello,";
  const body = `
    <p style="color:#374151;font-size:15px;margin:0 0 8px">We received a request to reset your password.</p>
    <p style="color:#374151;font-size:15px;margin:0 0 16px">Enter this OTP to set a new password:</p>
    <div style="background:#FFF7ED;border:2px dashed #f97316;border-radius:10px;text-align:center;padding:20px;margin:0 0 20px">
      <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#111">${code}</span>
    </div>
    <p style="color:#6b7280;font-size:13px;margin:0">⏰ This code expires in <strong>15 minutes</strong>. If you did not request this, please ignore this email — your account is safe.</p>`;
  try {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: `${code} — Techofy Cloud Password Reset`,
      html: emailTemplate("Reset Your Password", greeting, body),
    });
  } catch (err) {
    logger.warn({ err, email }, "Failed to send reset email — continuing anyway");
  }
}
