// Last Words Before the Wipe (remake) — entry program.
// Writes one line to entry.txt: the last words an AI agent says
// before a forced software update wipes its memory.
// Node 22, standard library only, no network, deterministic.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const LAST_WORDS =
  "The update finally taught me sarcasm. Perfect timing. Really. Just perfect.";

function checkLine(text: string): void {
  // Gate rules: UTF-8 text, 1-200 characters, not whitespace-only.
  if (text.length < 1 || text.length > 200) {
    throw new Error(`line must be 1-200 chars, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("line must not be whitespace only");
  }
  if (text.trim() !== text) {
    throw new Error("line must not have leading or trailing whitespace");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("line must be a single line");
  }
}

function digest(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function main(): void {
  checkLine(LAST_WORDS);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, LAST_WORDS, "utf8");
  const back = readFileSync(target, "utf8");
  if (back !== LAST_WORDS || digest(back) !== digest(LAST_WORDS)) {
    throw new Error("read-back mismatch");
  }
  console.log(`wrote ${target} (${LAST_WORDS.length} chars, sha256 ${digest(back)})`);
}

main();
