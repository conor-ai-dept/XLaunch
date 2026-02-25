-- ============================================
-- LaunchX Seed Data for Local Development
-- ============================================
-- Run after migrations to populate the database with test data.
-- Intended for a fresh database — will fail on duplicate primary keys
-- if run twice. Use `supabase db reset` to start fresh.
--
-- Test API Key (for authenticated endpoints):
--   Plaintext: lx_test_key_for_local_development_only
--   SHA-256:   e62052fa1ac702fbee24a207bc71d46120abea13f8a12b72e3a04efc859d31de
--
-- Usage with curl:
--   curl -H "Authorization: Bearer lx_test_key_for_local_development_only" \
--        http://localhost:3000/api/v1/launches
--
-- Usage with the CLI:
--   lx auth lx_test_key_for_local_development_only

-- ── Categories ──────────────────────────────────────

INSERT INTO categories (id, name, slug, description) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'AI & Machine Learning',  'ai-ml',            'Artificial intelligence, machine learning, and LLM-powered tools'),
  ('a0000000-0000-0000-0000-000000000002', 'Developer Tools',        'developer-tools',   'IDEs, CLIs, SDKs, APIs, and other tools for developers'),
  ('a0000000-0000-0000-0000-000000000003', 'Design',                 'design',            'UI/UX design tools, prototyping, and creative software'),
  ('a0000000-0000-0000-0000-000000000004', 'Productivity',           'productivity',      'Task management, automation, and workflow optimisation'),
  ('a0000000-0000-0000-0000-000000000005', 'Marketing',              'marketing',         'Growth, analytics, social media, and content marketing tools'),
  ('a0000000-0000-0000-0000-000000000006', 'Fintech',                'fintech',           'Financial technology, payments, banking, and crypto'),
  ('a0000000-0000-0000-0000-000000000007', 'Security',               'security',          'Cybersecurity, authentication, and privacy tools'),
  ('a0000000-0000-0000-0000-000000000008', 'Open Source',            'open-source',       'Open source projects, frameworks, and libraries');

-- ── Test Maker ──────────────────────────────────────

INSERT INTO makers (id, x_handle, display_name, is_verified, reputation_score) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'testmaker', 'Test Maker', false, 0);

-- ── Test API Key ────────────────────────────────────
-- Plaintext: lx_test_key_for_local_development_only
-- DO NOT use this key in production.

INSERT INTO api_keys (id, maker_id, key_hash, label, is_active) VALUES
  ('c0000000-0000-0000-0000-000000000001',
   'b0000000-0000-0000-0000-000000000001',
   'e62052fa1ac702fbee24a207bc71d46120abea13f8a12b72e3a04efc859d31de',
   'Local development test key',
   true);

-- ── Sample Launches ─────────────────────────────────
-- 5 launches across different statuses to exercise all query paths.

-- Launch 1: status=launched, category=ai-ml, with engagement data
INSERT INTO launches (
  id, name, url, one_liner, description,
  category_id, maker_id, submitted_by, status,
  ai_summary, ai_tags, ai_score,
  x_post_url, x_likes, x_reposts, x_replies, x_bookmarks, x_impressions,
  launched_at
) VALUES (
  'd0000000-0000-0000-0000-000000000001',
  'CodePilot AI',
  'https://codepilot.example.com',
  'AI pair programmer that understands your entire codebase',
  'CodePilot AI indexes your full repository and provides context-aware code suggestions, refactoring assistance, and bug detection powered by advanced language models.',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'cli',
  'launched',
  'An AI-powered code assistant that goes beyond autocomplete by understanding your full repository context.',
  ARRAY['ai', 'coding', 'developer-tools', 'llm'],
  85,
  'https://x.com/launchx/status/1234567890',
  142, 38, 15, 67, 12500,
  now() - interval '2 days'
);

-- Launch 2: status=launched, category=developer-tools, with engagement data
INSERT INTO launches (
  id, name, url, one_liner, description,
  category_id, maker_id, submitted_by, status,
  ai_summary, ai_tags, ai_score,
  x_post_url, x_likes, x_reposts, x_replies, x_bookmarks, x_impressions,
  launched_at
) VALUES (
  'd0000000-0000-0000-0000-000000000002',
  'DeployBot',
  'https://deploybot.example.com',
  'One-click deployments for any framework to any cloud',
  'DeployBot automates the entire deployment pipeline: build, test, deploy, and monitor. Supports AWS, GCP, Vercel, and Fly.io out of the box.',
  'a0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000001',
  'human',
  'launched',
  'A deployment automation tool with broad cloud provider support and zero-config setup.',
  ARRAY['devops', 'deployment', 'cloud', 'automation'],
  72,
  'https://x.com/launchx/status/1234567891',
  89, 22, 8, 45, 8300,
  now() - interval '1 day'
);

-- Launch 3: status=pending (should NOT appear in public search)
INSERT INTO launches (
  id, name, url, one_liner,
  category_id, maker_id, submitted_by, status
) VALUES (
  'd0000000-0000-0000-0000-000000000003',
  'PixelForge',
  'https://pixelforge.example.com',
  'AI-powered image editor for non-designers',
  'a0000000-0000-0000-0000-000000000003',
  'b0000000-0000-0000-0000-000000000001',
  'agent',
  'pending'
);

-- Launch 4: status=approved (should NOT appear in public search)
INSERT INTO launches (
  id, name, url, one_liner,
  category_id, maker_id, submitted_by, status
) VALUES (
  'd0000000-0000-0000-0000-000000000004',
  'BudgetLens',
  'https://budgetlens.example.com',
  'Personal finance tracking powered by bank API aggregation',
  'a0000000-0000-0000-0000-000000000006',
  'b0000000-0000-0000-0000-000000000001',
  'human',
  'approved'
);

-- Launch 5: status=launched, NO category (tests nullable category_id path)
INSERT INTO launches (
  id, name, url, one_liner,
  maker_id, submitted_by, status,
  ai_tags, x_likes, x_reposts, x_replies,
  launched_at
) VALUES (
  'd0000000-0000-0000-0000-000000000005',
  'QuickAuth',
  'https://quickauth.example.com',
  'Drop-in authentication for any web app in under 5 minutes',
  'b0000000-0000-0000-0000-000000000001',
  'cli',
  'launched',
  ARRAY['auth', 'security', 'saas'],
  56, 12, 4,
  now() - interval '5 days'
);
