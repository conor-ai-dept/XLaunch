import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createClient } from "@supabase/supabase-js";
import { getEnvOrThrow } from "@launchx/shared";
import { LaunchService } from "./services/launch.js";
import { createLaunchRouter } from "./routes/launches.js";

const app = express();
const port = parseInt(process.env.PORT ?? "3000", 10);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Supabase client (service role for full access)
const supabase = createClient(
  getEnvOrThrow("SUPABASE_URL"),
  getEnvOrThrow("SUPABASE_SERVICE_ROLE_KEY")
);

// Services
const launchService = new LaunchService(supabase);

// Routes
app.use("/api/v1", createLaunchRouter(launchService, supabase));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: "0.1.0" });
});

// Start
app.listen(port, () => {
  console.log(`🚀 LaunchX API running on http://localhost:${port}`);
});

export default app;
