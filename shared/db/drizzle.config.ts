import { defineConfig } from "drizzle-kit";
import path from "path";

const DB_URL = "postgresql://neondb_owner:npg_nHRXNL0bzoQ1@ep-little-flower-apyhb8d6-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL,
  },
});
