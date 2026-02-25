-- ============================================
-- LaunchX Migration 3: Indexes & Triggers
-- ============================================
-- Performance indexes and auto-update triggers.

-- ── Indexes ─────────────────────────────────────────

-- Launches: filtered by status in nearly every query
CREATE INDEX idx_launches_status ON launches(status);

-- Launches: ordered/filtered by launch date in trending and timeframe queries
CREATE INDEX idx_launches_launched_at ON launches(launched_at);

-- Launches: filtered by maker for ownership lookups
CREATE INDEX idx_launches_maker_id ON launches(maker_id);

-- Launches: filtered by category for category-based browsing
CREATE INDEX idx_launches_category_id ON launches(category_id);

-- Note: makers.x_handle, categories.slug, and api_keys.key_hash
-- already have implicit B-tree indexes from their UNIQUE constraints.

-- ── Updated_at Trigger ──────────────────────────────
-- Automatically sets updated_at = now() on row modification.
-- Applied to launches and makers (the two tables with updated_at).

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_launches_updated_at
  BEFORE UPDATE ON launches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_makers_updated_at
  BEFORE UPDATE ON makers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
