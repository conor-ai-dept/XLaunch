import { z } from "zod";

export const submitLaunchSchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url(),
  one_liner: z.string().min(1).max(280),
  description: z.string().max(2000).optional(),
  video_url: z.string().url().optional(),
  category_slug: z.string().optional(),
  x_handle: z
    .string()
    .min(1)
    .max(50)
    .transform((v) => (v.startsWith("@") ? v.slice(1) : v)),
  submitted_by: z.enum(["human", "agent", "cli"]).default("human"),
  agent_id: z.string().optional(),
});

export const searchLaunchesSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  timeframe: z.enum(["today", "week", "month", "all"]).default("week"),
  min_score: z.coerce.number().min(0).optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export const trendingSchema = z.object({
  category: z.string().optional(),
  timeframe: z.enum(["today", "week", "month"]).default("week"),
  limit: z.coerce.number().min(1).max(50).default(10),
});
