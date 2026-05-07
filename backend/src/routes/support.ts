import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, usersTable, supportTicketsTable, ticketMessagesTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { CreateTicketBody, ReplyToTicketBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/support/tickets", requireAuth, async (req, res): Promise<void> => {
  const tickets = await db
    .select()
    .from(supportTicketsTable)
    .where(eq(supportTicketsTable.userId, req.userId!))
    .orderBy(desc(supportTicketsTable.createdAt));
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  res.json(
    tickets.map((t) => ({
      id: String(t.id),
      subject: t.subject,
      status: t.status,
      priority: t.priority,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      userId: String(t.userId),
      userEmail: user?.email ?? "",
    }))
  );
});

router.post("/support/tickets", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateTicketBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { subject, message, priority } = parsed.data;
  const [ticket] = await db
    .insert(supportTicketsTable)
    .values({ userId: req.userId!, subject, priority })
    .returning();
  await db.insert(ticketMessagesTable).values({
    ticketId: ticket.id,
    userId: req.userId!,
    content: message,
    isAdmin: false,
  });
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  res.json({
    id: String(ticket.id),
    subject: ticket.subject,
    status: ticket.status,
    priority: ticket.priority,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
    userId: String(ticket.userId),
    userEmail: user?.email ?? "",
  });
});

router.get("/support/tickets/:ticketId", requireAuth, async (req, res): Promise<void> => {
  const ticketId = parseInt(Array.isArray(req.params.ticketId) ? req.params.ticketId[0] : req.params.ticketId);
  const [ticket] = await db
    .select()
    .from(supportTicketsTable)
    .where(eq(supportTicketsTable.id, ticketId));
  if (!ticket || ticket.userId !== req.userId!) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  const messages = await db
    .select()
    .from(ticketMessagesTable)
    .where(eq(ticketMessagesTable.ticketId, ticketId))
    .orderBy(ticketMessagesTable.createdAt);
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  const messagesWithAuthor = await Promise.all(
    messages.map(async (m) => {
      let authorName = "Support Team";
      if (!m.isAdmin && m.userId) {
        const [author] = await db.select().from(usersTable).where(eq(usersTable.id, m.userId));
        authorName = author?.name ?? author?.email ?? "User";
      }
      return { id: String(m.id), content: m.content, isAdmin: m.isAdmin, createdAt: m.createdAt.toISOString(), authorName };
    })
  );
  res.json({
    id: String(ticket.id),
    subject: ticket.subject,
    status: ticket.status,
    priority: ticket.priority,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
    userId: String(ticket.userId),
    userEmail: user?.email ?? "",
    messages: messagesWithAuthor,
  });
});

router.post("/support/tickets/:ticketId/reply", requireAuth, async (req, res): Promise<void> => {
  const ticketId = parseInt(Array.isArray(req.params.ticketId) ? req.params.ticketId[0] : req.params.ticketId);
  const [ticket] = await db.select().from(supportTicketsTable).where(eq(supportTicketsTable.id, ticketId));
  if (!ticket || ticket.userId !== req.userId!) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  const parsed = ReplyToTicketBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  await db.insert(ticketMessagesTable).values({
    ticketId,
    userId: req.userId!,
    content: parsed.data.message,
    isAdmin: false,
  });
  await db.update(supportTicketsTable).set({ updatedAt: new Date() }).where(eq(supportTicketsTable.id, ticketId));
  res.json({ message: "Reply added" });
});

export default router;
