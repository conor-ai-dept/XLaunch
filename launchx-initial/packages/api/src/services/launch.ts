import { SupabaseClient } from "@supabase/supabase-js";
import type {
  LaunchPublic,
  SubmitLaunchRequest,
  SubmitLaunchResponse,
  SearchLaunchesRequest,
  SearchLaunchesResponse,
  TrendingResponse,
} from "@launchx/shared";

export class LaunchService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Submit a new launch. Creates maker if they don't exist yet.
   */
  async submit(input: SubmitLaunchRequest): Promise<SubmitLaunchResponse> {
    // Upsert maker by x_handle
    const { data: maker, error: makerError } = await this.supabase
      .from("makers")
      .upsert(
        { x_handle: input.x_handle, display_name: input.x_handle },
        { onConflict: "x_handle" }
      )
      .select("id")
      .single();

    if (makerError || !maker) {
      throw new Error(`Failed to upsert maker: ${makerError?.message}`);
    }

    // Resolve category if provided
    let categoryId: string | null = null;
    if (input.category_slug) {
      const { data: cat } = await this.supabase
        .from("categories")
        .select("id")
        .eq("slug", input.category_slug)
        .single();
      categoryId = cat?.id ?? null;
    }

    // Insert launch
    const { data: launch, error: launchError } = await this.supabase
      .from("launches")
      .insert({
        name: input.name,
        url: input.url,
        one_liner: input.one_liner,
        description: input.description ?? null,
        video_url: input.video_url ?? null,
        category_id: categoryId,
        maker_id: maker.id,
        submitted_by: input.submitted_by ?? "human",
        agent_id: input.agent_id ?? null,
        status: "pending",
      })
      .select("id, status")
      .single();

    if (launchError || !launch) {
      throw new Error(`Failed to create launch: ${launchError?.message}`);
    }

    return {
      id: launch.id,
      status: launch.status,
      message: "Launch submitted successfully! It will be reviewed and scheduled for a daily drop.",
    };
  }

  /**
   * Search launched products with optional filters.
   */
  async search(params: SearchLaunchesRequest): Promise<SearchLaunchesResponse> {
    const { query, category, timeframe, min_score, limit = 20, offset = 0 } = params;

    let q = this.supabase
      .from("launches")
      .select(
        `
        id, name, url, one_liner, description, video_url,
        ai_summary, ai_tags, x_likes, x_reposts, x_replies, x_post_url, launched_at,
        categories!inner(name, slug),
        makers!inner(x_handle, display_name, avatar_url, is_verified)
      `,
        { count: "exact" }
      )
      .eq("status", "launched");

    // Timeframe filter
    if (timeframe && timeframe !== "all") {
      const now = new Date();
      let since: Date;
      switch (timeframe) {
        case "today":
          since = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }
      q = q.gte("launched_at", since!.toISOString());
    }

    // Category filter
    if (category) {
      q = q.eq("categories.slug", category);
    }

    // Text search (basic ilike for MVP, upgrade to full-text later)
    if (query) {
      q = q.or(`name.ilike.%${query}%,one_liner.ilike.%${query}%,ai_tags.cs.{${query}}`);
    }

    // Score filter
    if (min_score !== undefined) {
      q = q.gte("x_likes", min_score);
    }

    // Order by engagement, paginate
    q = q.order("x_likes", { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await q;
    if (error) {
      throw new Error(`Search failed: ${error.message}`);
    }

    const launches: LaunchPublic[] = (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name,
      url: row.url,
      one_liner: row.one_liner,
      description: row.description,
      video_url: row.video_url,
      category: row.categories,
      maker: row.makers,
      ai_summary: row.ai_summary,
      ai_tags: row.ai_tags,
      x_likes: row.x_likes,
      x_reposts: row.x_reposts,
      x_replies: row.x_replies,
      x_post_url: row.x_post_url,
      launched_at: row.launched_at,
    }));

    return { launches, total: count ?? 0, limit, offset };
  }

  /**
   * Get trending launches by engagement.
   */
  async trending(
    timeframe: "today" | "week" | "month" = "week",
    category?: string,
    limit: number = 10
  ): Promise<TrendingResponse> {
    const result = await this.search({
      timeframe,
      category,
      limit,
      offset: 0,
    });

    return {
      launches: result.launches,
      timeframe,
      category,
    };
  }

  /**
   * Get a single launch by ID.
   */
  async getById(id: string): Promise<LaunchPublic | null> {
    const { data, error } = await this.supabase
      .from("launches")
      .select(
        `
        id, name, url, one_liner, description, video_url,
        ai_summary, ai_tags, x_likes, x_reposts, x_replies, x_post_url, launched_at,
        categories(name, slug),
        makers(x_handle, display_name, avatar_url, is_verified)
      `
      )
      .eq("id", id)
      .eq("status", "launched")
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      url: data.url,
      one_liner: data.one_liner,
      description: data.description,
      video_url: data.video_url,
      category: (data as any).categories,
      maker: (data as any).makers,
      ai_summary: data.ai_summary,
      ai_tags: data.ai_tags,
      x_likes: data.x_likes,
      x_reposts: data.x_reposts,
      x_replies: data.x_replies,
      x_post_url: data.x_post_url,
      launched_at: data.launched_at,
    };
  }

  /**
   * Get all categories.
   */
  async getCategories() {
    const { data, error } = await this.supabase
      .from("categories")
      .select("name, slug, description")
      .order("name");

    if (error) throw new Error(`Failed to fetch categories: ${error.message}`);
    return data ?? [];
  }
}
