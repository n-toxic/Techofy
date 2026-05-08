import { pgTable, text, serial, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { instancesTable } from "./instances.js";

export const serverPoolStatusEnum = pgEnum("server_pool_status", ["AVAILABLE", "ASSIGNED", "MAINTENANCE"]);
export const serverPoolTypeEnum = pgEnum("server_pool_type", ["RDP", "VPS"]);

export const serverPoolTable = pgTable("server_pool", {
  id: serial("id").primaryKey(),
  ip: text("ip").notNull(),
  rootUsername: text("root_username").notNull(),
  rootPasswordHash: text("root_password_hash").notNull(),
  type: serverPoolTypeEnum("type").notNull(),
  status: serverPoolStatusEnum("status").notNull().default("AVAILABLE"),
  location: text("location").default("US-East"),
  assignedInstanceId: integer("assigned_instance_id").references(() => instancesTable.id),
  addedAt: timestamp("added_at").notNull().defaultNow(),
});

export type ServerPool = typeof serverPoolTable.$inferSelect;
