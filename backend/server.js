import "dotenv/config";
import dns from "dns";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const missing = ["MONGODB_URI", "JWT_SECRET", "GEMINI_API_KEY"].filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

try {
  await connectToDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (error) {
  console.error("Failed to start server:", error.message);
  process.exit(1);
}