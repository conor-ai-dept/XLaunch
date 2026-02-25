// ============================================
// LaunchX Core Types
// ============================================

export type SubmissionSource = "human" | "agent" | "cli";
export type LaunchStatus = "pending" | "approved" | "rejected" | "launched" | "archived";

// --------------------------------------------
// Database row types (match Supabase schema)
// --------------------------------------------

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Maker {
  id: string;
  x_handle: string;
  display_name: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  reputation_score: number;
  created_at: string;
  updated_at: string;
}

export interface Launch {
  id: string;
  name: string;
  url: string;
  one_liner: string;
  description: string | null;
  video_url: string | null;
  video_generated: boolean;
  category_id: string | null;
  maker_id: string;

  // Submission metadata
  submitted_by: SubmissionSource;
  agent_id: string | null;
  status: LaunchStatus;

  // AI enrichment
  ai_summary: string | null;
  ai_tags: string[];
  ai_score: number | null;

  // X integration
  x_post_id: string | null;
  x_post_url: string | null;
  x_likes: number;
  x_reposts: number;
  x_replies: number;
  x_bookmarks: number;
  x_impressions: number;

  // Scheduling
  scheduled_at: string | null;
  launched_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface DailyDrop {
  id: string;
  drop_date: string;
  featured_launch_id: string | null;
  x_thread_id: string | null;
  created_at: string;
}

export interface DailyDropLaunch {
  daily_drop_id: string;
  launch_id: string;
  position: number;
}

export interface ApiKey {
  id: string;
  maker_id: string;
  key_hash: string;
  label: string | null;
  last_used_at: string | null;
  is_active: boolean;
  created_at: string;
}

// --------------------------------------------
// API request/response types
// --------------------------------------------

export interface SubmitLaunchRequest {
  name: string;
  url: string;
  one_liner: string;
  description?: string;
  video_url?: string;
  category_slug?: string;
  x_handle: string;
  submitted_by?: SubmissionSource;
  agent_id?: string;
}

export interface SubmitLaunchResponse {
  id: string;
  status: LaunchStatus;
  message: string;
}

export interface SearchLaunchesRequest {
  query?: string;
  category?: string;
  timeframe?: "today" | "week" | "month" | "all";
  min_score?: number;
  limit?: number;
  offset?: number;
}

export interface SearchLaunchesResponse {
  launches: LaunchPublic[];
  total: number;
  limit: number;
  offset: number;
}

/** Public-facing launch data (joined with category and maker) */
export interface LaunchPublic {
  id: string;
  name: string;
  url: string;
  one_liner: string;
  description: string | null;
  video_url: string | null;
  category: Pick<Category, "name" | "slug"> | null;
  maker: Pick<Maker, "x_handle" | "display_name" | "avatar_url" | "is_verified">;
  ai_summary: string | null;
  ai_tags: string[];
  x_likes: number;
  x_reposts: number;
  x_replies: number;
  x_post_url: string | null;
  launched_at: string | null;
}

export interface TrendingResponse {
  launches: LaunchPublic[];
  timeframe: string;
  category?: string;
}
