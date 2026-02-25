import { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import { SupabaseClient } from "@supabase/supabase-js";

export function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export function generateApiKey(): string {
  return `lx_${crypto.randomBytes(32).toString("hex")}`;
}

/**
 * Middleware that authenticates requests via API key in the
 * Authorization header: `Bearer lx_...`
 *
 * Sets req.makerId on success.
 */
export function apiKeyAuth(supabase: SupabaseClient) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing API key. Use: Authorization: Bearer lx_..." });
      return;
    }

    const key = authHeader.slice(7);
    const keyHash = hashApiKey(key);

    const { data, error } = await supabase
      .from("api_keys")
      .select("id, maker_id, is_active")
      .eq("key_hash", keyHash)
      .single();

    if (error || !data || !data.is_active) {
      res.status(401).json({ error: "Invalid or inactive API key" });
      return;
    }

    // Update last_used_at (fire and forget)
    supabase
      .from("api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", data.id)
      .then(() => {});

    // Attach maker ID to request
    (req as any).makerId = data.maker_id;
    next();
  };
}
