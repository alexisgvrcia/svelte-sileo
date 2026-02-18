import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const bump = process.argv[2];
const allowed = new Set(["patch", "minor", "major"]);

if (!allowed.has(bump)) {
  console.error("Usage: node scripts/release.mjs <patch|minor|major>");
  process.exit(1);
}

const run = (command) =>
  execSync(command, { stdio: "pipe", encoding: "utf8" }).trim();

try {
  run("git rev-parse --is-inside-work-tree");
} catch {
  console.error("This command must run inside a git repository.");
  process.exit(1);
}

const status = run("git status --porcelain");
if (status) {
  console.error("Working tree is not clean. Commit or stash changes first.");
  process.exit(1);
}

run(`pnpm version ${bump} --no-git-tag-version`);
run("pnpm install --lockfile-only");

const pkgPath = resolve(process.cwd(), "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const version = pkg.version;
const tag = `v${version}`;

run("git add package.json pnpm-lock.yaml");
run(`git commit -m "release: ${tag}"`);
run(`git tag ${tag}`);
run("git push --follow-tags");

console.log(`Created, tagged, and pushed ${tag}`);
