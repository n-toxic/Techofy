import pino from "pino";

// pino-pretty removed — crashes on Vercel serverless
export const logger = pino({
  level: "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
  ],
});
