import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = __dirname;
const OUTPUT_FILE = path.join(PROJECT_ROOT, "code-frontend.txt");

const INCLUDE_DIRS = ["src", "public", "scripts", "tests"];

const IGNORE_NAMES = new Set([
  "node_modules",
  ".git",
  ".github",
  "dist",
  "build",
  "coverage",
  ".next",
  ".cache",
  ".vscode",
  ".idea",
  "logs",
  "tmp",
  "uploads",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs",
  ".json",
  ".css", ".scss", ".sass", ".less",
  ".html",
  ".md", ".mdx",
  ".yml", ".yaml",
]);

const MAX_FILE_SIZE = 200 * 1024;

const isAllowedFile = (filename) =>
  filename.endsWith(".env.example") ||
  ALLOWED_EXTENSIONS.has(path.extname(filename).toLowerCase());

const isBinary = (buffer) => buffer.includes(0);

async function getFiles(dir) {
  const files = [];

  let entries;

  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    if (IGNORE_NAMES.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await getFiles(fullPath)));
      continue;
    }

    if (!entry.isFile() || !isAllowedFile(entry.name)) continue;

    try {
      const stat = await fs.stat(fullPath);

      if (stat.size > MAX_FILE_SIZE) {
        files.push({
          path: path.relative(PROJECT_ROOT, fullPath),
          content: `[Skipped: file exceeds ${MAX_FILE_SIZE / 1024} KB]`,
        });
        continue;
      }

      const buffer = await fs.readFile(fullPath);

      if (isBinary(buffer)) continue;

      files.push({
        path: path.relative(PROJECT_ROOT, fullPath).replace(/\\/g, "/"),
        content: buffer.toString("utf8"),
      });
    } catch {
      // Skip files that cannot be read.
    }
  }

  return files;
}

async function generateCodebase() {
  try {
    const files = [];

    for (const dir of INCLUDE_DIRS) {
      files.push(...(await getFiles(path.join(PROJECT_ROOT, dir))));
    }

    files.sort((a, b) => a.path.localeCompare(b.path));

    const output = files
      .map(
        (file) =>
          `\n${"=".repeat(80)}\nFILE: ${file.path}\n${"=".repeat(80)}\n\n${file.content}\n`
      )
      .join("\n");

    await fs.writeFile(OUTPUT_FILE, output, "utf8");

    console.log(`Codebase exported successfully!`);
    console.log(`Files included: ${files.length}`);
    console.log(`Output: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Failed to export codebase:", error.message);
    process.exitCode = 1;
  }
}

generateCodebase();