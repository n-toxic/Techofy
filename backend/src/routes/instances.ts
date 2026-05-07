import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, usersTable, instancesTable, portRulesTable, transactionsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { DeployInstanceBody, AddInstancePortBody } from "@workspace/api-zod";

const router: IRouter = Router();

const PLANS: Record<string, { monthlyCost: number }> = {
  "rdp-4": { monthlyCost: 299 },
  "rdp-8": { monthlyCost: 599 },
  "rdp-16": { monthlyCost: 1199 },
  "rdp-32": { monthlyCost: 2399 },
  "vps-4": { monthlyCost: 249 },
  "vps-8": { monthlyCost: 499 },
  "vps-16": { monthlyCost: 999 },
  "vps-32": { monthlyCost: 2199 },
};

function calcCost(type: "RDP" | "VPS", ram: number): number {
  const key = `${type.toLowerCase()}-${ram}`;
  return PLANS[key]?.monthlyCost ?? (type === "RDP" ? ram * 250 : ram * 125);
}

router.get("/instances", requireAuth, async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(instancesTable)
    .where(eq(instancesTable.userId, req.userId!))
    .orderBy(desc(instancesTable.createdAt));
  res.json(
    rows.map((i) => ({
      id: String(i.id),
      type: i.type,
      os: i.os,
      ram: i.ram,
      cpu: i.cpu,
      storage: i.storage,
      hostname: i.hostname ?? undefined,
      status: i.status,
      monthlyCost: i.monthlyCost,
      createdAt: i.createdAt.toISOString(),
      location: i.location ?? "US-East",
    }))
  );
});

router.post("/instances", requireAuth, async (req, res): Promise<void> => {
  const parsed = DeployInstanceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { type, os, ram, cpu, storage, location, customUsername } = parsed.data;
  const monthlyCost = calcCost(type, ram);

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  if (!user || user.walletBalance < monthlyCost) {
    res.status(402).json({ error: "Insufficient wallet balance. Please deposit funds." });
    return;
  }

  await db
    .update(usersTable)
    .set({ walletBalance: user.walletBalance - monthlyCost })
    .where(eq(usersTable.id, req.userId!));

  await db.insert(transactionsTable).values({
    userId: req.userId!,
    amount: monthlyCost,
    type: "DEDUCTION",
    description: `${type} ${ram}GB ${os} server deployment`,
    status: "SUCCESS",
  });

  const [instance] = await db
    .insert(instancesTable)
    .values({
      userId: req.userId!,
      type,
      os,
      ram,
      cpu: cpu ?? 2,
      storage,
      status: "PENDING",
      monthlyCost,
      location: location ?? "US-East",
      username: customUsername ?? (type === "RDP" ? "TechofyUser" : "techofy"),
    })
    .returning();

  await db.insert(portRulesTable).values([
    { instanceId: instance.id, port: type === "RDP" ? 3389 : 22, protocol: "TCP", direction: "INBOUND", description: type === "RDP" ? "Remote Desktop" : "SSH" },
    { instanceId: instance.id, port: 80, protocol: "TCP", direction: "INBOUND", description: "HTTP" },
    { instanceId: instance.id, port: 443, protocol: "TCP", direction: "INBOUND", description: "HTTPS" },
  ]);

  res.json({
    id: String(instance.id),
    type: instance.type,
    os: instance.os,
    ram: instance.ram,
    cpu: instance.cpu,
    storage: instance.storage,
    hostname: instance.hostname ?? undefined,
    status: instance.status,
    monthlyCost: instance.monthlyCost,
    createdAt: instance.createdAt.toISOString(),
    location: instance.location ?? "US-East",
  });
});

router.get("/instances/:instanceId", requireAuth, async (req, res): Promise<void> => {
  const instanceId = parseInt(Array.isArray(req.params.instanceId) ? req.params.instanceId[0] : req.params.instanceId);
  const [instance] = await db
    .select()
    .from(instancesTable)
    .where(and(eq(instancesTable.id, instanceId), eq(instancesTable.userId, req.userId!)));
  if (!instance) {
    res.status(404).json({ error: "Instance not found" });
    return;
  }
  const ports = await db.select().from(portRulesTable).where(eq(portRulesTable.instanceId, instanceId));
  res.json({
    id: String(instance.id),
    type: instance.type,
    os: instance.os,
    ram: instance.ram,
    cpu: instance.cpu,
    storage: instance.storage,
    hostname: instance.hostname ?? undefined,
    status: instance.status,
    monthlyCost: instance.monthlyCost,
    createdAt: instance.createdAt.toISOString(),
    location: instance.location ?? "US-East",
    ports: ports.map((p) => ({
      id: String(p.id),
      port: p.port,
      protocol: p.protocol,
      description: p.description ?? "",
      direction: p.direction,
    })),
  });
});

router.post("/instances/:instanceId/start", requireAuth, async (req, res): Promise<void> => {
  const instanceId = parseInt(Array.isArray(req.params.instanceId) ? req.params.instanceId[0] : req.params.instanceId);
  const [instance] = await db
    .select()
    .from(instancesTable)
    .where(and(eq(instancesTable.id, instanceId), eq(instancesTable.userId, req.userId!)));
  if (!instance) { res.status(404).json({ error: "Instance not found" }); return; }
  await db.update(instancesTable).set({ status: "RUNNING", updatedAt: new Date() }).where(eq(instancesTable.id, instanceId));
  res.json({ message: "Instance started" });
});

router.post("/instances/:instanceId/stop", requireAuth, async (req, res): Promise<void> => {
  const instanceId = parseInt(Array.isArray(req.params.instanceId) ? req.params.instanceId[0] : req.params.instanceId);
  const [instance] = await db
    .select()
    .from(instancesTable)
    .where(and(eq(instancesTable.id, instanceId), eq(instancesTable.userId, req.userId!)));
  if (!instance) { res.status(404).json({ error: "Instance not found" }); return; }
  await db.update(instancesTable).set({ status: "STOPPED", updatedAt: new Date() }).where(eq(instancesTable.id, instanceId));
  res.json({ message: "Instance stopped" });
});

router.post("/instances/:instanceId/reboot", requireAuth, async (req, res): Promise<void> => {
  const instanceId = parseInt(Array.isArray(req.params.instanceId) ? req.params.instanceId[0] : req.params.instanceId);
  
  const [instance] = await db
    .select()
    .from(instancesTable)
    .where(and(eq(instancesTable.id, instanceId), eq(instancesTable.userId, req.userId!)));
    
  if (!instance) { 
    res.status(404).json({ error: "Instance not found" }); 
    return; 
  }
  await db.update(instancesTable)
    .set({ status: "DEPLOYING", updatedAt: new Date() })
    .where(eq(instancesTable.id, instanceId));
    
  setTimeout(async () => {
    try {
      await db.update(instancesTable)
        .set({ status: "RUNNING", updatedAt: new Date() })
        .where(eq(instancesTable.id, instanceId));
    } catch (err) {
      console.error("Reboot status update failed:", err);
    }
  }, 15000); 

  res.json({ message: "Instance is rebooting" });
});


router.get("/instances/:instanceId/credentials", requireAuth, async (req, res): Promise<void> => {
  const instanceId = parseInt(Array.isArray(req.params.instanceId) ? req.params.instanceId[0] : req.params.instanceId);
  const [instance] = await db
    .select()
    .from(instancesTable)
    .where(and(eq(instancesTable.id, instanceId), eq(instancesTable.userId, req.userId!)));
  if (!instance) { res.status(404).json({ error: "Instance not found" }); return; }
  res.json({
    hostname: instance.hostname ?? `pending-${instance.id}.edev.fun`,
    username: instance.username ?? "techofy",
    password: instance.passwordHash ?? "Pending assignment",
    port: instance.type === "RDP" ? 3389 : 22,
  });
});

router.get("/instances/:instanceId/ports", requireAuth, async (req, res): Promise<void> => {
  const instanceId = parseInt(Array.isArray(req.params.instanceId) ? req.params.instanceId[0] : req.params.instanceId);
  const [instance] = await db.select().from(instancesTable).where(and(eq(instancesTable.id, instanceId), eq(instancesTable.userId, req.userId!)));
  if (!instance) { res.status(404).json({ error: "Instance not found" }); return; }
  const ports = await db.select().from(portRulesTable).where(eq(portRulesTable.instanceId, instanceId));
  res.json(ports.map((p) => ({ id: String(p.id), port: p.port, protocol: p.protocol, description: p.description ?? "", direction: p.direction })));
});

router.post("/instances/:instanceId/ports", requireAuth, async (req, res): Promise<void> => {
  const instanceId = parseInt(Array.isArray(req.params.instanceId) ? req.params.instanceId[0] : req.params.instanceId);
  const [instance] = await db.select().from(instancesTable).where(and(eq(instancesTable.id, instanceId), eq(instancesTable.userId, req.userId!)));
  if (!instance) { res.status(404).json({ error: "Instance not found" }); return; }
  const parsed = AddInstancePortBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [rule] = await db.insert(portRulesTable).values({ instanceId, ...parsed.data }).returning();
  res.json({ id: String(rule.id), port: rule.port, protocol: rule.protocol, description: rule.description ?? "", direction: rule.direction });
});

router.delete("/instances/:instanceId/ports/:portId", requireAuth, async (req, res): Promise<void> => {
  const instanceId = parseInt(Array.isArray(req.params.instanceId) ? req.params.instanceId[0] : req.params.instanceId);
  const portId = parseInt(Array.isArray(req.params.portId) ? req.params.portId[0] : req.params.portId);
  const [instance] = await db.select().from(instancesTable).where(and(eq(instancesTable.id, instanceId), eq(instancesTable.userId, req.userId!)));
  if (!instance) { res.status(404).json({ error: "Instance not found" }); return; }
  await db.delete(portRulesTable).where(and(eq(portRulesTable.id, portId), eq(portRulesTable.instanceId, instanceId)));
  res.json({ message: "Port rule removed" });
});

router.get("/plans", async (_req, res): Promise<void> => {
  res.json([
    { id: "rdp-4", name: "RDP Starter", type: "RDP", os: "Windows Server 2022", ram: 4, cpu: 2, storage: 100, monthlyCost: 299, features: ["Full GUI Remote Desktop", "Admin Access", "4GB RAM", "2 vCPU", "100GB SSD", "Speed Up to 4 Gbps"], popular: false },
    { id: "rdp-8", name: "RDP Pro", type: "RDP", os: "Windows Server 2022", ram: 8, cpu: 4, storage: 200, monthlyCost: 599, features: ["Full GUI Remote Desktop", "Admin Access", "8GB RAM", "4 vCPU", "200GB SSD", "Speed Up to 4 Gbps", "Daily Backups"], popular: true },
    { id: "rdp-16", name: "RDP Business", type: "RDP", os: "Windows Server 2022", ram: 16, cpu: 8, storage: 320, monthlyCost: 1199, features: ["Full GUI Remote Desktop", "Admin Access", "16GB RAM", "8 vCPU", "320GB SSD", "Speed Up to 4 Gbps", "Daily Backups", "Priority Support"], popular: false },
    { id: "vps-4", name: "VPS Starter", type: "VPS", os: "Ubuntu 22.04 LTS", ram: 4, cpu: 2, storage: 80, monthlyCost: 249, features: ["Root SSH Access", "Ubuntu 22.04", "4GB RAM", "2 vCPU", "80GB SSD", "Speed Up to 4 Gbps"], popular: false },
    { id: "vps-8", name: "VPS Pro", type: "VPS", os: "Ubuntu 22.04 LTS", ram: 8, cpu: 4, storage: 160, monthlyCost: 499, features: ["Root SSH Access", "Ubuntu 22.04", "8GB RAM", "4 vCPU", "160GB SSD", "Speed Up to 4 Gbps", "Daily Backups"], popular: true },
    { id: "vps-16", name: "VPS Business", type: "VPS", os: "Ubuntu 22.04 LTS", ram: 16, cpu: 6, storage: 320, monthlyCost: 999, features: ["Root SSH Access", "Ubuntu 22.04", "16GB RAM", "6 vCPU", "320GB SSD", "Speed Up to 4 Gbps", "Daily Backups", "Priority Support"], popular: false },
  ]);
});

export default router;
