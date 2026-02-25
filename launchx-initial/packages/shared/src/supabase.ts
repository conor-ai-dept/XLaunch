import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function createSupabaseClient(
  url: string,
  key: string
): SupabaseClient {
  return createClient(url, key);
}

export function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
