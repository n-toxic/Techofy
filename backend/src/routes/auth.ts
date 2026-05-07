import { Router, type IRouter } from "express";
import { eq, and, gt } from "drizzle-orm";
import { db, usersTable, otpsTable } from "@workspace/db";
import { hashPassword, verifyPassword, signToken, generateOtp } from "../lib/auth";
import { sendOtpEmail, sendPasswordResetEmail } from "../lib/mailer";
import { requireAuth } from "../middlewares/auth";
import { z } from "zod";

const router: IRouter = Router();

const RegisterBody = z.object({ email: z.string().email(), password: z.string().min(6), name: z.string().min(2) });
const LoginBody = z.object({ email: z.string().email(), password: z.string().min(1) });
const VerifyOtpBody = z.object({ email: z.string().email(), code: z.string().length(6) });
const RequestOtpBody = z.object({ email: z.string().email() });
const ForgotPasswordBody = z.object({ email: z.string().email() });
const ResetPasswordBody = z.object({ email: z.string().email(), code: z.string().length(6), newPassword: z.string().min(6) });

// Simple in-memory rate limiting
const otpAttempts = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(key: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = otpAttempts.get(key);
  if (!record || record.resetAt < now) { otpAttempts.set(key, { count: 1, resetAt: now + windowMs }); return true; }
  if (record.count >= maxAttempts) return false;
  record.count++;
  return true;
}

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input. Email, password (min 6 chars), name (min 2 chars) required." }); return; }
  const { email, password, name } = parsed.data;
  const emailLower = email.toLowerCase().trim();
  const existing = await db.select().from(usersTable).where(eq(usersTable.email, emailLower));
  if (existing.length > 0) { res.status(400).json({ error: "Email already registered" }); return; }
  const passwordHash = hashPassword(password);
  await db.insert(usersTable).values({ email: emailLower, passwordHash, name: name.trim(), role: "USER" });
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await db.delete(otpsTable).where(eq(otpsTable.email, emailLower));
  await db.insert(otpsTable).values({ email: emailLower, code: otp, expiresAt });
  await sendOtpEmail(emailLower, otp, name);
  res.json({ message: "OTP sent to your email. Please verify to activate your account." });
});

router.post("/auth/verify-otp", async (req, res): Promise<void> => {
  const parsed = VerifyOtpBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const { email, code } = parsed.data;
  const emailLower = email.toLowerCase().trim();
  if (!checkRateLimit(`verify:${emailLower}`, 5, 15 * 60 * 1000)) { res.status(429).json({ error: "Too many attempts. Try again in 15 minutes." }); return; }
  const now = new Date();
  const [otp] = await db.select().from(otpsTable).where(and(eq(otpsTable.email, emailLower), eq(otpsTable.code, code), gt(otpsTable.expiresAt, now)));
  if (!otp) { res.status(400).json({ error: "Invalid or expired OTP" }); return; }
  await db.delete(otpsTable).where(eq(otpsTable.email, emailLower));
  const [user] = await db.update(usersTable).set({ isVerified: "true" }).where(eq(usersTable.email, emailLower)).returning();
  if (!user) { res.status(400).json({ error: "User not found" }); return; }
  const token = signToken({ userId: user.id, role: user.role });
  res.json({ user: { id: String(user.id), email: user.email, name: user.name ?? undefined, role: user.role, walletBalance: user.walletBalance, createdAt: user.createdAt.toISOString() }, token });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }
  const { email, password } = parsed.data;
  const emailLower = email.toLowerCase().trim();
  if (!checkRateLimit(`login:${emailLower}`, 10, 15 * 60 * 1000)) { res.status(429).json({ error: "Too many login attempts. Try again in 15 minutes." }); return; }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, emailLower));
  if (!user || !verifyPassword(password, user.passwordHash)) { res.status(401).json({ error: "Invalid email or password" }); return; }
  if (user.isVerified !== "true") {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await db.delete(otpsTable).where(eq(otpsTable.email, emailLower));
    await db.insert(otpsTable).values({ email: emailLower, code: otp, expiresAt });
    await sendOtpEmail(emailLower, otp, user.name ?? "");
    res.status(403).json({ error: "Account not verified." });
    return;
  }
  const token = signToken({ userId: user.id, role: user.role });
  res.json({ user: { id: String(user.id), email: user.email, name: user.name ?? undefined, role: user.role, walletBalance: user.walletBalance, createdAt: user.createdAt.toISOString() }, token });
});

router.post("/auth/request-otp", async (req, res): Promise<void> => {
  const parsed = RequestOtpBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid email" }); return; }
  const { email } = parsed.data;
  const emailLower = email.toLowerCase().trim();
  if (!checkRateLimit(`otp:${emailLower}`, 3, 10 * 60 * 1000)) { res.status(429).json({ error: "Too many OTP requests. Wait 10 minutes." }); return; }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, emailLower));
  if (user) {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await db.delete(otpsTable).where(eq(otpsTable.email, emailLower));
    await db.insert(otpsTable).values({ email: emailLower, code: otp, expiresAt });
    await sendOtpEmail(emailLower, otp, user.name ?? "");
  }
  res.json({ message: "If this email exists, an OTP has been sent." });
});

// FORGOT PASSWORD - sends reset OTP to email
router.post("/auth/forgot-password", async (req, res): Promise<void> => {
  const parsed = ForgotPasswordBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid email" }); return; }
  const { email } = parsed.data;
  const emailLower = email.toLowerCase().trim();
  if (!checkRateLimit(`forgot:${emailLower}`, 3, 15 * 60 * 1000)) { res.status(429).json({ error: "Too many requests. Wait 15 minutes." }); return; }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, emailLower));
  if (user) {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await db.delete(otpsTable).where(eq(otpsTable.email, emailLower));
    await db.insert(otpsTable).values({ email: emailLower, code: otp, expiresAt });
    await sendPasswordResetEmail(emailLower, otp, user.name ?? "");
  }
  res.json({ message: "Password reset OTP has been sent." });
});

// RESET PASSWORD - verify OTP then set new password
router.post("/auth/reset-password", async (req, res): Promise<void> => {
  const parsed = ResetPasswordBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input. Password must be at least 6 characters." }); return; }
  const { email, code, newPassword } = parsed.data;
  const emailLower = email.toLowerCase().trim();
  if (!checkRateLimit(`reset:${emailLower}`, 5, 15 * 60 * 1000)) { res.status(429).json({ error: "Too many attempts. Try again in 15 minutes." }); return; }
  const now = new Date();
  const [otp] = await db.select().from(otpsTable).where(and(eq(otpsTable.email, emailLower), eq(otpsTable.code, code), gt(otpsTable.expiresAt, now)));
  if (!otp) { res.status(400).json({ error: "Invalid or expired OTP" }); return; }
  await db.delete(otpsTable).where(eq(otpsTable.email, emailLower));
  const passwordHash = hashPassword(newPassword);
  const [user] = await db.update(usersTable).set({ passwordHash, isVerified: "true" }).where(eq(usersTable.email, emailLower)).returning();
  if (!user) { res.status(400).json({ error: "User not found" }); return; }
  res.json({ message: "Password reset successfully. You can now log in." });
});

router.post("/auth/logout", async (_req, res): Promise<void> => {
  res.json({ message: "Logged out successfully" });
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  if (!user) { res.status(401).json({ error: "User not found" }); return; }
  res.json({ id: String(user.id), email: user.email, name: user.name ?? undefined, role: user.role, walletBalance: user.walletBalance, createdAt: user.createdAt.toISOString() });
});

export default router;
