-- ============================================
-- LaunchX Migration 1: Enums & Base Tables
-- ============================================
-- Creates enum types and tables with no foreign key dependencies.

-- Enum: how a launch was submitted to the platform
CREATE TYPE submission_source AS ENUM ('human', 'agent', 'cli');

-- Enum: lifecycle states for a launch
CREATE TYPE launch_status AS ENUM ('pending', 'approved', 'rejected', 'launched', 'archived');

-- ── Categories ──────────────────────────────────────
-- Product categories for organising launches.
CREATE TABLE categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── Makers ──────────────────────────────────────────
-- Users who submit launches, identified by their X handle.
CREATE TABLE makers (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  x_handle         text NOT NULL UNIQUE,
  display_name     text,
  avatar_url       text,
  is_verified      boolean NOT NULL DEFAULT false,
  reputation_score integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
