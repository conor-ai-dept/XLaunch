import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { LaunchService } from "./services/launch.js";
import { createLaunchRouter } from "./routes/launches.js";
import { createMockSupabaseClient } from "./mock-supabase.js";

const app = express();
const port = parseInt(process.env.PORT ?? "3000", 10);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Supabase client — use real client if credentials are available, otherwise in-memory mock
let supabase: SupabaseClient;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log("Using Supabase backend");
} else {
  console.log("No Supabase credentials found — running with in-memory mock data");
  supabase = createMockSupabaseClient() as SupabaseClient;
}

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
  console.log(`LaunchX API running on http://localhost:${port}`);
});

export default app;
