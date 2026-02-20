const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const scanDirs = [
  path.join(rootDir, "controllers"),
  path.join(rootDir, "routes"),
  path.join(rootDir, "middlewares"),
];

const violations = [];

const filePatterns = [
  /\.(js|cjs|mjs)$/i,
];

const forbiddenPatterns = [
  {
    name: "in-memory domain array/object",
    regex: /\b(let|var|const)\s+(users?|letters?|templates?|records?|items|data)\s*=\s*(\[\]|\[|\{)/i,
  },
  {
    name: "in-memory map/set store",
    regex: /\bnew\s+(Map|Set)\s*\(/,
  },
  {
    name: "mock/dummy domain data",
    regex: /\b(mock|dummy|fake|seedData|inMemory)\b/i,
  },
  {
    name: "browser storage used in server",
    regex: /\b(localStorage|sessionStorage|indexedDB)\b/,
  },
];

function shouldScanFile(filePath) {
  return filePatterns.some((pattern) => pattern.test(filePath));
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    forbiddenPatterns.forEach((rule) => {
      if (rule.regex.test(line)) {
        violations.push({
          filePath,
          line: index + 1,
          rule: rule.name,
          snippet: line.trim(),
        });
      }
    });
  });
}

function walk(dirPath) {
  if (!fs.existsSync(dirPath)) return;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      return;
    }

    if (entry.isFile() && shouldScanFile(fullPath)) {
      scanFile(fullPath);
    }
  });
}

scanDirs.forEach((directory) => walk(directory));

if (violations.length > 0) {
  console.error("❌ Persistence guard failed. Store app data in PostgreSQL via Prisma, not in-memory.");
  violations.forEach((v) => {
    const relativePath = path.relative(rootDir, v.filePath).replace(/\\/g, "/");
    console.error(`- ${relativePath}:${v.line} [${v.rule}] ${v.snippet}`);
  });
  process.exit(1);
}

console.log("✅ Persistence guard passed. No in-memory domain data patterns found.");
