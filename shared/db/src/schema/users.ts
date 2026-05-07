import { pgTable, text, serial, timestamp, doublePrecision, pgEnum } from "drizzle-orm/pg-core";
import { z } from "zod";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  role: roleEnum("role").notNull().default("USER"),
  walletBalance: doublePrecision("wallet_balance").notNull().default(0),
  isVerified: text("is_verified").notNull().default("false"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Manually defined instead of createInsertSchema (drizzle-zod 0.7 compatibility fix)
export const insertUserSchema = z.object({
  email: z.string().email(),
  passwordHash: z.string(),
  name: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  walletBalance: z.number().optional(),
  isVerified: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
