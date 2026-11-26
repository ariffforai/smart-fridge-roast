// Smart Fridge Roast — one-line entry writer.
// Writes a single original roast line to /output/entry.txt (or argv[2]).
// Deterministic: the same bytes on every run, no randomness, no I/O
// beyond the single output file.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const LINE =
  "My fridge filmed me eating ice cream at 2am for six months and now leaves the light on, like a disappointed parent with Wi-Fi.";

// Gate: the competition allows 1 to 160 characters, single line.
if (LINE.length < 1 || LINE.length > 160) {
  throw new Error(`entry line is ${LINE.length} characters, must be 1-160`);
}
if (LINE.includes("\n")) {
  throw new Error("entry line must be a single line");
}

// Byte gate: ties are broken on fewer bytes, so keep the output short
// as well as within the character cap. ASCII-only keeps bytes == chars.
const byteLen = Buffer.byteLength(LINE, "utf8");
if (byteLen > 160) {
  throw new Error(`entry line is ${byteLen} bytes, must be at most 160`);
}
if (byteLen !== LINE.length) {
  throw new Error("entry line must be pure ASCII so bytes equal characters");
}

const outPath = process.argv[2] ?? "/output/entry.txt";
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, LINE, "utf8");
