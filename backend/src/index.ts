import app from "./app";
import { logger } from "./lib/logger";

const port = 5000;

app.listen(port, () => {
  logger.info({ port }, "Techofy Cloud API server listening");
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
