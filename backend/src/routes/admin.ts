import { Router, type IRouter } from "express";
import { eq, desc, count } from "drizzle-orm";
import { db, usersTable, instancesTable, transactionsTable, supportTicketsTable, ticketMessagesTable, serverPoolTable } from "@workspace/db";
import { requireAuth, requireAdmin } from "../middlewares/auth";
import { AdjustUserWalletBody, AssignInstanceBody, AddServerToPoolBody } from "@workspace/api-zod";
import { hashPassword } from "../lib/auth";

const router: IRouter = Router();

router.get("/admin/stats", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const [{ totalUsers }] = await db.select({ totalUsers: count() }).from(usersTable);
  const [{ totalInstances }] = await db.select({ totalInstances: count() }).from(instancesTable);
  const [{ activeInstances }] = await db.select({ activeInstances: count() }).from(instancesTable).where(eq(instancesTable.status, "RUNNING"));
  const [{ pendingInstances }] = await db.select({ pendingInstances: count() }).from(instancesTable).where(eq(instancesTable.status, "PENDING"));
  const [{ openTickets }] = await db.select({ openTickets: count() }).from(supportTicketsTable).where(eq(supportTicketsTable.status, "OPEN"));
  const [{ serverPoolAvailable }] = await db.select({ serverPoolAvailable: count() }).from(serverPoolTable).where(eq(serverPoolTable.status, "AVAILABLE"));

  const allTx = await db.select({ amount: transactionsTable.amount, type: transactionsTable.type, status: transactionsTable.status, date: transactionsTable.createdAt }).from(transactionsTable);
  const totalRevenue = allTx.filter((t) => t.type === "DEPOSIT" && t.status === "SUCCESS").reduce((sum, t) => sum + t.amount, 0);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyRevenue = allTx.filter((t) => t.type === "DEPOSIT" && t.status === "SUCCESS" && t.date >= monthStart).reduce((sum, t) => sum + t.amount, 0);

  res.json({ totalUsers, totalInstances, activeInstances, pendingInstances, openTickets, serverPoolAvailable, totalRevenue, monthlyRevenue });
});

router.get("/admin/users", requireAuth, requireAdmin, async (_req, res): Promise<void> => {
  const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
  const result = await Promise.all(
    users.map(async (u) => {
      const [{ instanceCount }] = await db.select({ instanceCount: count() }).from(instancesTable).where(eq(instancesTable.userId, u.id));
      const txs = await db.select({ amount: transactionsTable.amount, type: transactionsTable.type, status: transactionsTable.status }).from(transactionsTable).where(eq(transactionsTable.userId, u.id));
      const totalSpent = txs.filter((t) => t.type === "DEDUCTION" && t.status === "SUCCESS").reduce((sum, t) => sum + t.amount, 0);
      return { id: String(u.id), email: u.email, name: u.name ?? undefined, role: u.role, walletBalance: u.walletBalance, instanceCount, totalSpent, createdAt: u.createdAt.toISOString() };
    })
  );
  res.json(result);
});

router.put("/admin/users/:userId/wallet", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const userId = parseInt(Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId);
  const parsed = AdjustUserWalletBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  const newBalance = user.walletBalance + parsed.data.amount;
  await db.update(usersTable).set({ walletBalance: Math.max(0, newBalance) }).where(eq(usersTable.id, userId));
  await db.insert(transactionsTable).values({
    userId,
    amount: Math.abs(parsed.data.amount),
    type: parsed.data.amount > 0 ? "DEPOSIT" : "DEDUCTION",
    description: `Admin adjustment: ${parsed.data.reason}`,
    status: "SUCCESS",
  });
  res.json({ message: `Wallet adjusted by ₹${parsed.data.amount}` });
});

router.get("/admin/instances", requireAuth, requireAdmin, async (_req, res): Promise<void> => {
  const instances = await db.select().from(instancesTable).orderBy(desc(instancesTable.createdAt));
  const result = await Promise.all(
    instances.map(async (i) => {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, i.userId));
      return {
        id: String(i.id),
        userId: String(i.userId),
        userEmail: user?.email ?? "",
        type: i.type,
        os: i.os,
        ram: i.ram,
        cpu: i.cpu,
        storage: i.storage,
        hostname: i.hostname ?? undefined,
        rawIp: i.rawIp ?? undefined,
        status: i.status,
        monthlyCost: i.monthlyCost,
        createdAt: i.createdAt.toISOString(),
      };
    })
  );
  res.json(result);
});

router.put("/admin/instances/:instanceId/assign", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const instanceId = parseInt(Array.isArray(req.params.instanceId) ? req.params.instanceId[0] : req.params.instanceId);
  const parsed = AssignInstanceBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const { ip, username, password, hostname } = parsed.data;
  const generatedHostname = hostname ?? `techofy-${instanceId}.edev.fun`;
  await db.update(instancesTable).set({
    rawIp: ip,
    username,
    passwordHash: password,
    hostname: generatedHostname,
    status: "RUNNING",
    updatedAt: new Date(),
  }).where(eq(instancesTable.id, instanceId));
  res.json({ message: "Instance credentials assigned and activated" });
});

router.get("/admin/tickets", requireAuth, requireAdmin, async (_req, res): Promise<void> => {
  const tickets = await db.select().from(supportTicketsTable).orderBy(desc(supportTicketsTable.createdAt));
  const result = await Promise.all(
    tickets.map(async (t) => {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, t.userId));
      return { id: String(t.id), subject: t.subject, status: t.status, priority: t.priority, createdAt: t.createdAt.toISOString(), updatedAt: t.updatedAt.toISOString(), userId: String(t.userId), userEmail: user?.email ?? "" };
    })
  );
  res.json(result);
});

router.get("/admin/server-pool", requireAuth, requireAdmin, async (_req, res): Promise<void> => {
  const pool = await db.select().from(serverPoolTable).orderBy(desc(serverPoolTable.addedAt));
  res.json(pool.map((s) => ({
    id: String(s.id),
    ip: s.ip,
    rootUsername: s.rootUsername,
    type: s.type,
    status: s.status,
    location: s.location ?? "US-East",
    assignedInstanceId: s.assignedInstanceId ? String(s.assignedInstanceId) : undefined,
    addedAt: s.addedAt.toISOString(),
  })));
});

router.post("/admin/server-pool", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const parsed = AddServerToPoolBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const { ip, rootUsername, rootPassword, type, location } = parsed.data;
  const [entry] = await db.insert(serverPoolTable).values({
    ip,
    rootUsername,
    rootPasswordHash: hashPassword(rootPassword),
    type,
    location: location ?? "US-East",
    status: "AVAILABLE",
  }).returning();
  res.json({
    id: String(entry.id),
    ip: entry.ip,
    rootUsername: entry.rootUsername,
    type: entry.type,
    status: entry.status,
    location: entry.location ?? "US-East",
    addedAt: entry.addedAt.toISOString(),
  });
});

export default router;
