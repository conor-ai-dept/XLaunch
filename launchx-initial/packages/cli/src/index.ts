#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import Conf from "conf";

const config = new Conf({ projectName: "launchx" });
const API_BASE = process.env.LAUNCHX_API_URL ?? "https://api.launchx.dev/api/v1";

const program = new Command();

program.name("lx").description("🚀 LaunchX — Launch your product in 60 seconds").version("0.1.0");

// ── Auth ─────────────────────────────────────────

program
  .command("auth")
  .description("Set your API key")
  .argument("<api-key>", "Your LaunchX API key (starts with lx_)")
  .action((apiKey: string) => {
    if (!apiKey.startsWith("lx_")) {
      console.error(chalk.red("Invalid API key. Keys start with lx_"));
      process.exit(1);
    }
    config.set("apiKey", apiKey);
    console.log(chalk.green("✓ API key saved"));
  });

// ── Submit ───────────────────────────────────────

program
  .command("submit")
  .description("Submit a new product launch")
  .requiredOption("--name <name>", "Product name")
  .requiredOption("--url <url>", "Product URL")
  .requiredOption("--one-liner <text>", "One-line description (max 280 chars)")
  .requiredOption("--x-handle <handle>", "Your X/Twitter handle")
  .option("--description <text>", "Longer description")
  .option("--video <url>", "Demo video URL")
  .option("--category <slug>", "Category slug (e.g. ai-ml, developer-tools)")
  .action(async (opts) => {
    const apiKey = config.get("apiKey") as string;
    if (!apiKey) {
      console.error(chalk.red("Not authenticated. Run: lx auth <your-api-key>"));
      process.exit(1);
    }

    const spinner = ora("Submitting launch...").start();

    try {
      const res = await fetch(`${API_BASE}/launches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          name: opts.name,
          url: opts.url,
          one_liner: opts.oneLiner,
          description: opts.description,
          video_url: opts.video,
          category_slug: opts.category,
          x_handle: opts.xHandle,
          submitted_by: "cli",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        spinner.fail(chalk.red(`Failed: ${data.error}`));
        process.exit(1);
      }

      spinner.succeed(chalk.green("Launch submitted!"));
      console.log(chalk.dim(`  ID: ${data.id}`));
      console.log(chalk.dim(`  Status: ${data.status}`));
      console.log(chalk.dim(`  ${data.message}`));
    } catch (err: any) {
      spinner.fail(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

// ── Search ───────────────────────────────────────

program
  .command("search")
  .description("Search for launched products")
  .argument("[query]", "Search query")
  .option("--category <slug>", "Filter by category")
  .option("--timeframe <period>", "today | week | month | all", "week")
  .option("--limit <n>", "Max results", "10")
  .action(async (query, opts) => {
    const spinner = ora("Searching...").start();

    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (opts.category) params.set("category", opts.category);
      params.set("timeframe", opts.timeframe);
      params.set("limit", opts.limit);

      const res = await fetch(`${API_BASE}/launches?${params}`);
      const data = await res.json();

      spinner.stop();

      if (!data.launches?.length) {
        console.log(chalk.yellow("No launches found."));
        return;
      }

      console.log(chalk.bold(`\n Found ${data.total} launches:\n`));

      for (const launch of data.launches) {
        const likes = chalk.red(`♥ ${launch.x_likes}`);
        const reposts = chalk.blue(`⟲ ${launch.x_reposts}`);
        console.log(`  ${chalk.bold(launch.name)} ${chalk.dim("—")} ${launch.one_liner}`);
        console.log(`  ${likes}  ${reposts}  ${chalk.dim(launch.url)}`);
        if (launch.category) {
          console.log(`  ${chalk.cyan(`[${launch.category.name}]`)}`);
        }
        console.log();
      }
    } catch (err: any) {
      spinner.fail(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

// ── Trending ─────────────────────────────────────

program
  .command("trending")
  .description("See what's trending")
  .option("--category <slug>", "Filter by category")
  .option("--timeframe <period>", "today | week | month", "week")
  .action(async (opts) => {
    const spinner = ora("Fetching trending...").start();

    try {
      const params = new URLSearchParams();
      if (opts.category) params.set("category", opts.category);
      params.set("timeframe", opts.timeframe);

      const res = await fetch(`${API_BASE}/launches/trending?${params}`);
      const data = await res.json();

      spinner.stop();

      if (!data.launches?.length) {
        console.log(chalk.yellow("No trending launches found."));
        return;
      }

      console.log(chalk.bold(`\n🔥 Trending this ${opts.timeframe}:\n`));

      data.launches.forEach((launch: any, i: number) => {
        const rank = chalk.bold(`#${i + 1}`);
        const likes = chalk.red(`♥ ${launch.x_likes}`);
        console.log(`  ${rank} ${chalk.bold(launch.name)} ${likes}`);
        console.log(`     ${launch.one_liner}`);
        console.log(`     ${chalk.dim(launch.url)}`);
        console.log();
      });
    } catch (err: any) {
      spinner.fail(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

// ── Categories ───────────────────────────────────

program
  .command("categories")
  .description("List available categories")
  .action(async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();

      console.log(chalk.bold("\nCategories:\n"));
      for (const cat of data) {
        console.log(`  ${chalk.cyan(cat.slug)} — ${cat.name}`);
        if (cat.description) {
          console.log(`    ${chalk.dim(cat.description)}`);
        }
      }
      console.log();
    } catch (err: any) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

program.parse();
