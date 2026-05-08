import pino from "pino";

// pino-pretty is NOT used on Vercel — it crashes serverless functions.
// Use plain pino (JSON logs) in all environments.
export const logger = pino({
  level: "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
  ],
});
