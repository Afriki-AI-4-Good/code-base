import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const pagesDir = join(root, ".github-pages");
const journeyHtml = join(root, ".next/server/app/journey.html");

if (!existsSync(journeyHtml)) {
  throw new Error(
    "Missing .next/server/app/journey.html. Run `npm run build` before exporting the customer journey.",
  );
}

rmSync(pagesDir, { force: true, recursive: true });
mkdirSync(pagesDir, { recursive: true });
mkdirSync(join(pagesDir, "journey"), { recursive: true });

writeFileSync(
  join(pagesDir, "index.html"),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0; url=./journey/"><title>Afriki Customer Journey</title><script>window.location.replace("./journey/");</script></head><body><a href="./journey/">Open Afriki Customer Journey</a></body></html>`,
);
cpSync(journeyHtml, join(pagesDir, "journey/index.html"));
cpSync(join(root, ".next/static"), join(pagesDir, "_next/static"), {
  recursive: true,
});
cpSync(join(root, "public"), pagesDir, { recursive: true });

writeFileSync(join(pagesDir, ".nojekyll"), "");
