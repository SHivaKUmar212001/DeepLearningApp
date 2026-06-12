// Targeted lab screenshots: scrolls the first lab card into view and captures it.
// Usage: node scripts/shot.mjs <slug> <width> <outfile>
import { chromium } from "@playwright/test";

const [slug, width, out] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +width, height: 1000 } });
await page.goto(`http://localhost:3000/lessons/${slug}`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
const card = page.locator(".prose > div").first();
await card.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await card.screenshot({ path: out });
await browser.close();
console.log("saved", out);
