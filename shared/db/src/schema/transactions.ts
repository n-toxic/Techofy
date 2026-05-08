import { pgTable, text, serial, timestamp, doublePrecision, integer, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const transactionTypeEnum = pgEnum("transaction_type", ["DEPOSIT", "DEDUCTION"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["PENDING", "SUCCESS", "FAILED"]);

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  amount: doublePrecision("amount").notNull(),
  type: transactionTypeEnum("type").notNull(),
  description: text("description"),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  status: transactionStatusEnum("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Transaction = typeof transactionsTable.$inferSelect;
