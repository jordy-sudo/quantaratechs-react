import "dotenv/config";
import { createApp } from "./server/app.js";
const port = Number(process.env.PORT || 3001);
const app = createApp();
const server = app.listen(port, () =>
  console.log(`QuantaraTechs server running on http://127.0.0.1:${port}`),
);
function shutdown() {
  server.close(() => process.exit(0));
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
