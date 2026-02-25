import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getEnvOrThrow } from "@launchx/shared";

const supabase = createClient(
  getEnvOrThrow("SUPABASE_URL"),
  getEnvOrThrow("SUPABASE_SERVICE_ROLE_KEY")
);

const server = new McpServer({
  name: "launchx",
  version: "0.1.0",
});

// ── Tool: search_launches ────────────────────────

server.tool(
  "search_launches",
  "Search for product launches on LaunchX. Returns recently launched products sorted by engagement.",
  {
    query: z.string().optional().describe("Search query (product name, description, or tags)"),
    category: z.string().optional().describe("Category slug to filter by (e.g. 'ai-ml', 'developer-tools')"),
    timeframe: z.enum(["today", "week", "month", "all"]).default("week").describe("Time period to search"),
    limit: z.number().min(1).max(20).default(10).describe("Max results to return"),
  },
  async ({ query, category, timeframe, limit }) => {
    let q = supabase
      .from("launches")
      .select(
        `id, name, url, one_liner, description, video_url,
         ai_summary, ai_tags, x_likes, x_reposts, x_replies, x_post_url, launched_at,
         categories(name, slug),
         makers(x_handle, display_name)`
      )
      .eq("status", "launched");

    if (timeframe !== "all") {
      const now = new Date();
      const offsets = { today: 1, week: 7, month: 30 };
      const since = new Date(now.getTime() - offsets[timeframe] * 86400000);
      q = q.gte("launched_at", since.toISOString());
    }

    if (category) q = q.eq("categories.slug", category);
    if (query) q = q.or(`name.ilike.%${query}%,one_liner.ilike.%${query}%`);

    const { data, error } = await q
      .order("x_likes", { ascending: false })
      .limit(limit);

    if (error) {
      return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    }

    const results = (data ?? []).map((l: any) => ({
      name: l.name,
      url: l.url,
      one_liner: l.one_liner,
      category: l.categories?.name,
      maker: l.makers?.x_handle,
      likes: l.x_likes,
      reposts: l.x_reposts,
      video: l.video_url,
      launched: l.launched_at,
      ai_summary: l.ai_summary,
    }));

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }
);

// ── Tool: get_launch ─────────────────────────────

server.tool(
  "get_launch",
  "Get detailed information about a specific launch by ID.",
  {
    id: z.string().describe("Launch ID"),
  },
  async ({ id }) => {
    const { data, error } = await supabase
      .from("launches")
      .select(
        `*, categories(name, slug), makers(x_handle, display_name, is_verified)`
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return { content: [{ type: "text" as const, text: "Launch not found" }] };
    }

    return {
      content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    };
  }
);

// ── Tool: get_trending ───────────────────────────

server.tool(
  "get_trending",
  "Get the top trending product launches, ranked by engagement on X.",
  {
    category: z.string().optional().describe("Category slug to filter by"),
    timeframe: z.enum(["today", "week", "month"]).default("week").describe("Time period"),
    limit: z.number().min(1).max(20).default(10).describe("Number of results"),
  },
  async ({ category, timeframe, limit }) => {
    const now = new Date();
    const offsets = { today: 1, week: 7, month: 30 };
    const since = new Date(now.getTime() - offsets[timeframe] * 86400000);

    let q = supabase
      .from("launches")
      .select(
        `name, url, one_liner, x_likes, x_reposts, x_post_url, launched_at,
         categories(name, slug), makers(x_handle)`
      )
      .eq("status", "launched")
      .gte("launched_at", since.toISOString());

    if (category) q = q.eq("categories.slug", category);

    const { data, error } = await q
      .order("x_likes", { ascending: false })
      .limit(limit);

    if (error) {
      return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    }

    const ranked = (data ?? []).map((l: any, i: number) => ({
      rank: i + 1,
      name: l.name,
      url: l.url,
      one_liner: l.one_liner,
      likes: l.x_likes,
      reposts: l.x_reposts,
      maker: l.makers?.x_handle,
      category: l.categories?.name,
    }));

    return {
      content: [{ type: "text" as const, text: JSON.stringify(ranked, null, 2) }],
    };
  }
);

// ── Tool: get_categories ─────────────────────────

server.tool(
  "get_categories",
  "List all available product categories on LaunchX.",
  {},
  async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("name, slug, description")
      .order("name");

    if (error) {
      return { content: [{ type: "text" as const, text: `Error: ${error.message}` }] };
    }

    return {
      content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    };
  }
);

// ── Tool: submit_launch ──────────────────────────

server.tool(
  "submit_launch",
  "Submit a new product launch to LaunchX. The launch will be reviewed and then posted to X.",
  {
    name: z.string().describe("Product name"),
    url: z.string().url().describe("Product URL"),
    one_liner: z.string().max(280).describe("One-line description (max 280 chars)"),
    x_handle: z.string().describe("Maker's X/Twitter handle"),
    description: z.string().optional().describe("Longer product description"),
    video_url: z.string().url().optional().describe("Demo video URL"),
    category_slug: z.string().optional().describe("Category slug"),
    agent_id: z.string().optional().describe("Identifier of the submitting agent"),
  },
  async (input) => {
    // Upsert maker
    const { data: maker, error: makerErr } = await supabase
      .from("makers")
      .upsert(
        { x_handle: input.x_handle.replace(/^@/, ""), display_name: input.x_handle },
        { onConflict: "x_handle" }
      )
      .select("id")
      .single();

    if (makerErr || !maker) {
      return {
        content: [{ type: "text" as const, text: `Error creating maker: ${makerErr?.message}` }],
      };
    }

    // Resolve category
    let categoryId = null;
    if (input.category_slug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", input.category_slug)
        .single();
      categoryId = cat?.id ?? null;
    }

    const { data: launch, error } = await supabase
      .from("launches")
      .insert({
        name: input.name,
        url: input.url,
        one_liner: input.one_liner,
        description: input.description ?? null,
        video_url: input.video_url ?? null,
        category_id: categoryId,
        maker_id: maker.id,
        submitted_by: "agent",
        agent_id: input.agent_id ?? "unknown",
        status: "pending",
      })
      .select("id, status")
      .single();

    if (error || !launch) {
      return {
        content: [{ type: "text" as const, text: `Error: ${error?.message}` }],
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: `Launch submitted successfully!\nID: ${launch.id}\nStatus: ${launch.status}\nIt will be reviewed and scheduled for a daily drop on X.`,
        },
      ],
    };
  }
);

// ── Start server ─────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("LaunchX MCP server running on stdio");
}

main().catch(console.error);
