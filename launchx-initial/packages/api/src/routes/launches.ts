import { Router, Request, Response } from "express";
import { LaunchService } from "../services/launch.js";
import { submitLaunchSchema, searchLaunchesSchema, trendingSchema } from "../validation.js";
import { apiKeyAuth } from "../middleware/auth.js";
import { SupabaseClient } from "@supabase/supabase-js";

export function createLaunchRouter(launchService: LaunchService, supabase: SupabaseClient): Router {
  const router = Router();

  // ── Public routes ──────────────────────────────

  /** Search launches */
  router.get("/launches", async (req: Request, res: Response) => {
    try {
      const params = searchLaunchesSchema.parse(req.query);
      const result = await launchService.search(params);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  /** Get trending launches */
  router.get("/launches/trending", async (req: Request, res: Response) => {
    try {
      const params = trendingSchema.parse(req.query);
      const result = await launchService.trending(params.timeframe, params.category, params.limit);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  /** Get a single launch */
  router.get("/launches/:id", async (req: Request, res: Response) => {
    try {
      const launch = await launchService.getById(req.params.id);
      if (!launch) {
        res.status(404).json({ error: "Launch not found" });
        return;
      }
      res.json(launch);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  /** Get categories */
  router.get("/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await launchService.getCategories();
      res.json(categories);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── Authenticated routes ───────────────────────

  /** Submit a launch (requires API key) */
  router.post("/launches", apiKeyAuth(supabase), async (req: Request, res: Response) => {
    try {
      const input = submitLaunchSchema.parse(req.body);
      const result = await launchService.submit(input);
      res.status(201).json(result);
    } catch (err: any) {
      if (err.name === "ZodError") {
        res.status(400).json({ error: "Validation failed", details: err.errors });
        return;
      }
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
