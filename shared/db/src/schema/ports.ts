import { pgTable, text, serial, integer, pgEnum } from "drizzle-orm/pg-core";
import { instancesTable } from "./instances";

export const portProtocolEnum = pgEnum("port_protocol", ["TCP", "UDP"]);
export const portDirectionEnum = pgEnum("port_direction", ["INBOUND", "OUTBOUND"]);

export const portRulesTable = pgTable("port_rules", {
  id: serial("id").primaryKey(),
  instanceId: integer("instance_id").notNull().references(() => instancesTable.id),
  port: integer("port").notNull(),
  protocol: portProtocolEnum("protocol").notNull().default("TCP"),
  description: text("description"),
  direction: portDirectionEnum("direction").notNull().default("INBOUND"),
});

export type PortRule = typeof portRulesTable.$inferSelect;
