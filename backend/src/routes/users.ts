import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";
import Razorpay from "razorpay";
import { db, usersTable, transactionsTable, instancesTable, supportTicketsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { CreateDepositBody, VerifyDepositBody, UpdateProfileBody } from "@workspace/api-zod";

const router: IRouter = Router();

const RAZORPAY_KEY_ID = "rzp_test_SmTIYm8Ve8ckv8";
const RAZORPAY_SECRET = "52SqeA8LVmbDxSPZum75UTp1";

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET,
});

router.get("/users/wallet", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  res.json({ balance: user?.walletBalance ?? 0, currency: "INR" });
});

router.post("/users/deposit", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateDepositBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { amount } = parsed.data;
  if (amount < 10) {
    res.status(400).json({ error: "Minimum deposit is ₹10" });
    return;
  }
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    await db.insert(transactionsTable).values({
      userId: req.userId!,
      amount,
      type: "DEPOSIT",
      description: "Wallet top-up via Razorpay",
      razorpayOrderId: order.id,
      status: "PENDING",
    });
    res.json({
      orderId: order.id,
      amount: amount * 100,
      currency: "INR",
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (err) {
    req.log.error({ err }, "Razorpay order failed");
    res.status(500).json({ error: "Payment gateway error" });
  }
});

router.post("/users/deposit/verify", requireAuth, async (req, res): Promise<void> => {
  const parsed = VerifyDepositBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = parsed.data;
  
  const hmac = crypto.createHmac("sha256", RAZORPAY_SECRET);
  hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
  const expectedSig = hmac.digest("hex");

  if (expectedSig !== razorpaySignature) {
    res.status(400).json({ error: "Payment verification failed" });
    return;
  }

  const [tx] = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.razorpayOrderId, razorpayOrderId));
  if (!tx || tx.userId !== req.userId) {
    res.status(400).json({ error: "Transaction not found" });
    return;
  }

  await db
    .update(transactionsTable)
    .set({ status: "SUCCESS", razorpayPaymentId })
    .where(eq(transactionsTable.razorpayOrderId, razorpayOrderId));

  await db
    .update(usersTable)
    .set({ walletBalance: (await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)))[0].walletBalance + tx.amount })
    .where(eq(usersTable.id, req.userId!));

  res.json({ message: "Payment verified and wallet credited" });
});

router.put("/users/profile", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [user] = await db
    .update(usersTable)
    .set({ name: parsed.data.name })
    .where(eq(usersTable.id, req.userId!))
    .returning();
  res.json({
    id: String(user.id),
    email: user.email,
    name: user.name ?? undefined,
    role: user.role,
    walletBalance: user.walletBalance,
    createdAt: user.createdAt.toISOString(),
  });
});

router.get("/transactions", requireAuth, async (req, res): Promise<void> => {
  const txs = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.userId, req.userId!))
    .orderBy(desc(transactionsTable.createdAt));
  res.json(
    txs.map((tx) => ({
      id: String(tx.id),
      type: tx.type,
      amount: tx.amount,
      description: tx.description ?? "",
      status: tx.status,
      date: tx.createdAt.toISOString(),
    }))
  );
});

router.get("/dashboard/summary", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  const instances = await db.select().from(instancesTable).where(eq(instancesTable.userId, req.userId!));
  const tickets = await db
    .select()
    .from(supportTicketsTable)
    .where(eq(supportTicketsTable.userId, req.userId!));

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const txs = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.userId, req.userId!));

  const monthlySpend = txs
    .filter((t) => t.type === "DEDUCTION" && t.status === "SUCCESS" && t.createdAt >= monthStart)
    .reduce((sum, t) => sum + t.amount, 0);

  res.json({
    runningInstances: instances.filter((i) => i.status === "RUNNING").length,
    stoppedInstances: instances.filter((i) => i.status === "STOPPED").length,
    pendingInstances: instances.filter((i) => i.status === "PENDING" || i.status === "DEPLOYING").length,
    totalInstances: instances.length,
    walletBalance: user?.walletBalance ?? 0,
    monthlySpend,
    openTickets: tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length,
  });
});

export default router;
