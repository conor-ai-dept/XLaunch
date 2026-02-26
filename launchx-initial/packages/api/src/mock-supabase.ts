/**
 * In-memory mock of the Supabase client for local development without a database.
 * Supports the subset of the PostgREST query-builder API used by LaunchService and auth middleware.
 */

import crypto from "node:crypto";

// ── Seed data ────────────────────────────────────────

const categories = [
  { id: "a0000000-0000-0000-0000-000000000001", name: "AI & Machine Learning", slug: "ai-ml", description: "Artificial intelligence, machine learning, and LLM-powered tools", created_at: new Date().toISOString() },
  { id: "a0000000-0000-0000-0000-000000000002", name: "Developer Tools", slug: "developer-tools", description: "IDEs, CLIs, SDKs, APIs, and other tools for developers", created_at: new Date().toISOString() },
  { id: "a0000000-0000-0000-0000-000000000003", name: "Design", slug: "design", description: "UI/UX design tools, prototyping, and creative software", created_at: new Date().toISOString() },
  { id: "a0000000-0000-0000-0000-000000000004", name: "Productivity", slug: "productivity", description: "Task management, automation, and workflow optimisation", created_at: new Date().toISOString() },
  { id: "a0000000-0000-0000-0000-000000000005", name: "Marketing", slug: "marketing", description: "Growth, analytics, social media, and content marketing tools", created_at: new Date().toISOString() },
  { id: "a0000000-0000-0000-0000-000000000006", name: "Fintech", slug: "fintech", description: "Financial technology, payments, banking, and crypto", created_at: new Date().toISOString() },
  { id: "a0000000-0000-0000-0000-000000000007", name: "Security", slug: "security", description: "Cybersecurity, authentication, and privacy tools", created_at: new Date().toISOString() },
  { id: "a0000000-0000-0000-0000-000000000008", name: "Open Source", slug: "open-source", description: "Open source projects, frameworks, and libraries", created_at: new Date().toISOString() },
];

const makers = [
  { id: "b0000000-0000-0000-0000-000000000001", x_handle: "testmaker", display_name: "Test Maker", avatar_url: null, is_verified: false, reputation_score: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const apiKeys = [
  { id: "c0000000-0000-0000-0000-000000000001", maker_id: "b0000000-0000-0000-0000-000000000001", key_hash: "e62052fa1ac702fbee24a207bc71d46120abea13f8a12b72e3a04efc859d31de", label: "Local development test key", last_used_at: null, is_active: true, created_at: new Date().toISOString() },
];

const now = Date.now();
const launches = [
  {
    id: "d0000000-0000-0000-0000-000000000001", name: "CodePilot AI", url: "https://codepilot.example.com",
    one_liner: "AI pair programmer that understands your entire codebase",
    description: "CodePilot AI indexes your full repository and provides context-aware code suggestions, refactoring assistance, and bug detection powered by advanced language models.",
    video_url: null, video_generated: false,
    category_id: "a0000000-0000-0000-0000-000000000001", maker_id: "b0000000-0000-0000-0000-000000000001",
    submitted_by: "cli", agent_id: null, status: "launched",
    ai_summary: "An AI-powered code assistant that goes beyond autocomplete by understanding your full repository context.",
    ai_tags: ["ai", "coding", "developer-tools", "llm"], ai_score: 85,
    x_post_id: null, x_post_url: "https://x.com/launchx/status/1234567890",
    x_likes: 142, x_reposts: 38, x_replies: 15, x_bookmarks: 67, x_impressions: 12500,
    scheduled_at: null, launched_at: new Date(now - 2 * 86400000).toISOString(),
    created_at: new Date(now - 2 * 86400000).toISOString(), updated_at: new Date(now - 2 * 86400000).toISOString(),
  },
  {
    id: "d0000000-0000-0000-0000-000000000002", name: "DeployBot", url: "https://deploybot.example.com",
    one_liner: "One-click deployments for any framework to any cloud",
    description: "DeployBot automates the entire deployment pipeline: build, test, deploy, and monitor. Supports AWS, GCP, Vercel, and Fly.io out of the box.",
    video_url: null, video_generated: false,
    category_id: "a0000000-0000-0000-0000-000000000002", maker_id: "b0000000-0000-0000-0000-000000000001",
    submitted_by: "human", agent_id: null, status: "launched",
    ai_summary: "A deployment automation tool with broad cloud provider support and zero-config setup.",
    ai_tags: ["devops", "deployment", "cloud", "automation"], ai_score: 72,
    x_post_id: null, x_post_url: "https://x.com/launchx/status/1234567891",
    x_likes: 89, x_reposts: 22, x_replies: 8, x_bookmarks: 45, x_impressions: 8300,
    scheduled_at: null, launched_at: new Date(now - 86400000).toISOString(),
    created_at: new Date(now - 86400000).toISOString(), updated_at: new Date(now - 86400000).toISOString(),
  },
  {
    id: "d0000000-0000-0000-0000-000000000003", name: "PixelForge", url: "https://pixelforge.example.com",
    one_liner: "AI-powered image editor for non-designers",
    description: null, video_url: null, video_generated: false,
    category_id: "a0000000-0000-0000-0000-000000000003", maker_id: "b0000000-0000-0000-0000-000000000001",
    submitted_by: "agent", agent_id: null, status: "pending",
    ai_summary: null, ai_tags: [], ai_score: null,
    x_post_id: null, x_post_url: null,
    x_likes: 0, x_reposts: 0, x_replies: 0, x_bookmarks: 0, x_impressions: 0,
    scheduled_at: null, launched_at: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "d0000000-0000-0000-0000-000000000004", name: "BudgetLens", url: "https://budgetlens.example.com",
    one_liner: "Personal finance tracking powered by bank API aggregation",
    description: null, video_url: null, video_generated: false,
    category_id: "a0000000-0000-0000-0000-000000000006", maker_id: "b0000000-0000-0000-0000-000000000001",
    submitted_by: "human", agent_id: null, status: "approved",
    ai_summary: null, ai_tags: [], ai_score: null,
    x_post_id: null, x_post_url: null,
    x_likes: 0, x_reposts: 0, x_replies: 0, x_bookmarks: 0, x_impressions: 0,
    scheduled_at: null, launched_at: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "d0000000-0000-0000-0000-000000000005", name: "QuickAuth", url: "https://quickauth.example.com",
    one_liner: "Drop-in authentication for any web app in under 5 minutes",
    description: null, video_url: null, video_generated: false,
    category_id: null, maker_id: "b0000000-0000-0000-0000-000000000001",
    submitted_by: "cli", agent_id: null, status: "launched",
    ai_summary: null, ai_tags: ["auth", "security", "saas"], ai_score: null,
    x_post_id: null, x_post_url: null,
    x_likes: 56, x_reposts: 12, x_replies: 4, x_bookmarks: 0, x_impressions: 0,
    scheduled_at: null, launched_at: new Date(now - 5 * 86400000).toISOString(),
    created_at: new Date(now - 5 * 86400000).toISOString(), updated_at: new Date(now - 5 * 86400000).toISOString(),
  },
];

// ── Table store ──────────────────────────────────────

type Row = Record<string, unknown>;

const tables: Record<string, Row[]> = {
  categories: [...categories],
  makers: [...makers],
  api_keys: [...apiKeys],
  launches: [...launches],
};

function uuid(): string {
  return crypto.randomUUID();
}

// ── Query builder ────────────────────────────────────

interface QueryResult {
  data: Row[] | Row | null;
  error: { message: string } | null;
  count: number | null;
}

class MockQueryBuilder {
  private table: string;
  private rows: Row[];
  private filters: Array<(r: Row) => boolean> = [];
  private selectFields: string | null = null;
  private countMode: string | null = null;
  private orderField: string | null = null;
  private orderAsc = true;
  private rangeStart: number | null = null;
  private rangeEnd: number | null = null;
  private isSingle = false;
  private isUpsert = false;
  private upsertData: Row | null = null;
  private upsertConflict: string | null = null;
  private isInsert = false;
  private insertData: Row | null = null;
  private isUpdate = false;
  private updateData: Row | null = null;
  private doSelect = false;

  constructor(table: string) {
    this.table = table;
    this.rows = tables[table] ?? [];
  }

  select(fields?: string, opts?: { count?: string }) {
    this.doSelect = true;
    this.selectFields = fields ?? "*";
    if (opts?.count) this.countMode = opts.count;
    return this;
  }

  eq(col: string, val: unknown) {
    // Handle nested column filters like "categories.slug"
    if (col.includes(".")) {
      const [rel, field] = col.split(".");
      this.filters.push((r) => {
        const fkId = r[`${rel === "categories" ? "category" : rel.replace(/s$/, "")}_id`] as string | null;
        if (!fkId) return false;
        const relTable = tables[rel];
        if (!relTable) return false;
        const related = relTable.find((rr) => rr.id === fkId);
        return related?.[field] === val;
      });
    } else {
      this.filters.push((r) => r[col] === val);
    }
    return this;
  }

  gte(col: string, val: unknown) {
    this.filters.push((r) => {
      const v = r[col];
      if (typeof v === "number" && typeof val === "number") return v >= val;
      if (typeof v === "string" && typeof val === "string") return v >= val;
      return false;
    });
    return this;
  }

  or(expr: string) {
    // Parse simple PostgREST or() expressions: "name.ilike.%foo%,one_liner.ilike.%foo%,ai_tags.cs.{foo}"
    const parts = splitOrExpr(expr);
    this.filters.push((r) =>
      parts.some((part) => {
        const m = part.match(/^(\w+)\.(ilike)\.(.+)$/i);
        if (m) {
          const val = String(r[m[1]] ?? "");
          const pattern = m[3].replace(/%/g, "");
          return val.toLowerCase().includes(pattern.toLowerCase());
        }
        const m2 = part.match(/^(\w+)\.cs\.\{(.+)\}$/);
        if (m2) {
          const arr = r[m2[1]];
          if (Array.isArray(arr)) return arr.some((t: string) => t.toLowerCase().includes(m2[2].toLowerCase()));
        }
        return false;
      })
    );
    return this;
  }

  order(col: string, opts?: { ascending?: boolean }) {
    this.orderField = col;
    this.orderAsc = opts?.ascending ?? true;
    return this;
  }

  range(start: number, end: number) {
    this.rangeStart = start;
    this.rangeEnd = end;
    return this;
  }

  single() {
    this.isSingle = true;
    return this.execute();
  }

  upsert(data: Row, opts?: { onConflict?: string }) {
    this.isUpsert = true;
    this.upsertData = data;
    this.upsertConflict = opts?.onConflict ?? null;
    return this;
  }

  insert(data: Row) {
    this.isInsert = true;
    this.insertData = data;
    return this;
  }

  update(data: Row) {
    this.isUpdate = true;
    this.updateData = data;
    return this;
  }

  then(cb: (result: QueryResult) => void) {
    const result = this.execute();
    cb(result);
    return result;
  }

  private execute(): QueryResult {
    // Handle upsert
    if (this.isUpsert && this.upsertData) {
      const conflict = this.upsertConflict;
      let existing: Row | undefined;
      if (conflict) {
        existing = this.rows.find((r) => r[conflict] === this.upsertData![conflict]);
      }
      if (existing) {
        Object.assign(existing, this.upsertData);
      } else {
        const newRow: Row = { id: uuid(), ...this.upsertData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        this.rows.push(newRow);
        existing = newRow;
      }
      if (this.doSelect) {
        const projected = projectRow(existing, this.selectFields);
        return this.isSingle ? { data: projected, error: null, count: null } : { data: [projected], error: null, count: null };
      }
      return { data: existing, error: null, count: null };
    }

    // Handle insert
    if (this.isInsert && this.insertData) {
      const newRow: Row = { id: uuid(), ...this.insertData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      this.rows.push(newRow);
      if (this.doSelect) {
        const projected = projectRow(newRow, this.selectFields);
        return this.isSingle ? { data: projected, error: null, count: null } : { data: [projected], error: null, count: null };
      }
      return { data: newRow, error: null, count: null };
    }

    // Handle update
    if (this.isUpdate && this.updateData) {
      let filtered = this.rows;
      for (const f of this.filters) {
        filtered = filtered.filter(f);
      }
      for (const row of filtered) {
        Object.assign(row, this.updateData, { updated_at: new Date().toISOString() });
      }
      return { data: filtered, error: null, count: null };
    }

    // Handle select
    let result = [...this.rows];
    for (const f of this.filters) {
      result = result.filter(f);
    }

    const totalCount = result.length;

    if (this.orderField) {
      const col = this.orderField;
      const asc = this.orderAsc;
      result.sort((a, b) => {
        const va = a[col] as string | number;
        const vb = b[col] as string | number;
        if (va < vb) return asc ? -1 : 1;
        if (va > vb) return asc ? 1 : -1;
        return 0;
      });
    }

    if (this.rangeStart !== null && this.rangeEnd !== null) {
      result = result.slice(this.rangeStart, this.rangeEnd + 1);
    }

    // Join related tables for select expressions with relations
    const projected = result.map((r) => projectWithJoins(r, this.selectFields, this.table));

    if (this.isSingle) {
      if (projected.length === 0) return { data: null, error: { message: "No rows found" }, count: null };
      return { data: projected[0], error: null, count: null };
    }

    return { data: projected, error: null, count: this.countMode ? totalCount : null };
  }
}

// ── Helpers ──────────────────────────────────────────

function splitOrExpr(expr: string): string[] {
  // Split on commas that are not inside braces
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of expr) {
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function projectRow(row: Row, fields: string | null): Row {
  if (!fields || fields === "*") return { ...row };
  const cols = fields
    .split(",")
    .map((f) => f.trim())
    .filter((f) => !f.includes("(") && !f.includes("!"));
  const result: Row = {};
  for (const col of cols) {
    if (col in row) result[col] = row[col];
  }
  return result;
}

function projectWithJoins(row: Row, fields: string | null, tableName: string): Row {
  const result = projectRow(row, fields);

  if (!fields) return result;

  // Detect join patterns like: categories!inner(name, slug) or makers(x_handle, display_name, ...)
  const joinRe = /(\w+)(?:!inner)?\(([^)]+)\)/g;
  let match;
  while ((match = joinRe.exec(fields)) !== null) {
    const relTable = match[1];
    const relFields = match[2].split(",").map((f) => f.trim());
    // Determine FK column
    const fkCol = relTable === "categories" ? "category_id" : relTable === "makers" ? "maker_id" : `${relTable.replace(/s$/, "")}_id`;
    const fkId = row[fkCol] as string | null;
    if (fkId && tables[relTable]) {
      const related = tables[relTable].find((r) => r.id === fkId);
      if (related) {
        const projected: Row = {};
        for (const f of relFields) {
          if (f in related) projected[f] = related[f];
        }
        result[relTable] = projected;
      } else {
        result[relTable] = null;
      }
    } else {
      result[relTable] = null;
    }
  }

  return result;
}

// ── Public API ───────────────────────────────────────

export function createMockSupabaseClient(): unknown {
  return {
    from(table: string) {
      return new MockQueryBuilder(table);
    },
  };
}
