-- ============================================
-- LaunchX Migration 2: Dependent Tables
-- ============================================
-- Creates tables that reference categories and makers.

-- ── Launches ────────────────────────────────────────
-- The core entity: a product launch submitted by a maker.
CREATE TABLE launches (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  url             text NOT NULL,
  one_liner       text NOT NULL,
  description     text,
  video_url       text,
  video_generated boolean NOT NULL DEFAULT false,

  -- Relationships
  category_id     uuid REFERENCES categories(id) ON DELETE SET NULL,
  maker_id        uuid NOT NULL REFERENCES makers(id) ON DELETE CASCADE,

  -- Submission metadata
  submitted_by    submission_source NOT NULL DEFAULT 'human',
  agent_id        text,
  status          launch_status NOT NULL DEFAULT 'pending',

  -- AI enrichment
  ai_summary      text,
  ai_tags         text[] NOT NULL DEFAULT '{}',
  ai_score        numeric,

  -- X (Twitter) integration
  x_post_id       text,
  x_post_url      text,
  x_likes         integer NOT NULL DEFAULT 0,
  x_reposts       integer NOT NULL DEFAULT 0,
  x_replies       integer NOT NULL DEFAULT 0,
  x_bookmarks     integer NOT NULL DEFAULT 0,
  x_impressions   integer NOT NULL DEFAULT 0,

  -- Scheduling
  scheduled_at    timestamptz,
  launched_at     timestamptz,

  -- Timestamps
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ── Daily Drops ─────────────────────────────────────
-- A curated batch of launches posted to X on a specific date.
CREATE TABLE daily_drops (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drop_date           date NOT NULL UNIQUE,
  featured_launch_id  uuid REFERENCES launches(id) ON DELETE SET NULL,
  x_thread_id         text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ── Daily Drop Launches ─────────────────────────────
-- Junction table: which launches appear in which daily drop, with ordering.
CREATE TABLE daily_drop_launches (
  daily_drop_id  uuid NOT NULL REFERENCES daily_drops(id) ON DELETE CASCADE,
  launch_id      uuid NOT NULL REFERENCES launches(id) ON DELETE CASCADE,
  position       integer NOT NULL,
  PRIMARY KEY (daily_drop_id, launch_id)
);

-- ── API Keys ────────────────────────────────────────
-- Authentication keys for makers to access the API.
CREATE TABLE api_keys (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  maker_id     uuid NOT NULL REFERENCES makers(id) ON DELETE CASCADE,
  key_hash     text NOT NULL UNIQUE,
  label        text,
  last_used_at timestamptz,
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);
