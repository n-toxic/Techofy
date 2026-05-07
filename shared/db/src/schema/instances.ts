import { pgTable, text, serial, timestamp, doublePrecision, integer, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const instanceTypeEnum = pgEnum("instance_type", ["RDP", "VPS"]);
export const instanceStatusEnum = pgEnum("instance_status", ["PENDING", "RUNNING", "STOPPED", "DEPLOYING"]);

export const instancesTable = pgTable("instances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  type: instanceTypeEnum("type").notNull(),
  os: text("os").notNull(),
  ram: integer("ram").notNull(),
  cpu: integer("cpu").notNull(),
  storage: integer("storage").notNull(),
  hostname: text("hostname"),
  rawIp: text("raw_ip"),
  username: text("username"),
  passwordHash: text("password_hash"),
  status: instanceStatusEnum("status").notNull().default("PENDING"),
  monthlyCost: doublePrecision("monthly_cost").notNull(),
  location: text("location").default("US-East"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Instance = typeof instancesTable.$inferSelect;
