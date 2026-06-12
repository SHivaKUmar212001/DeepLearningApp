// Overflow audit: visits every page at 1440px and 1920px and reports
// (a) horizontal document scroll and (b) elements visibly spilling outside
// their lab card border. Elements clipped by an overflow-x ancestor
// (intentional scroll regions) are ignored.
//
// Usage: node scripts/audit-overflow.mjs [baseUrl]

import { chromium } from "@playwright/test";
import fs from "node:fs";

const BASE = process.argv[2] || "http://localhost:3000";
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

const slugs = fs
  .readdirSync("content/lessons")
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => `/lessons/${f.replace(/\.mdx$/, "")}`);

const pages = ["/", "/curriculum", "/playground", ...slugs];

const auditScript = () => {
  const findings = [];

  const docEl = document.documentElement;
  if (docEl.scrollWidth > docEl.clientWidth + 1) {
    findings.push({
      type: "page-hscroll",
      detail: `scrollWidth ${docEl.scrollWidth} > clientWidth ${docEl.clientWidth}`,
    });
  }

  const describe = (el) => {
    const cls = (el.getAttribute("class") || "").split(/\s+/).slice(0, 4).join(".");
    return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`;
  };

  const clippedHorizontally = (el, card) => {
    let p = el.parentElement;
    while (p && p !== card) {
      const s = getComputedStyle(p);
      if (s.overflowX !== "visible") return true;
      p = p.parentElement;
    }
    return false;
  };

  const cards = document.querySelectorAll(".prose > div, main section.glass, main .glass");
  for (const card of cards) {
    const cardRect = card.getBoundingClientRect();
    if (cardRect.width === 0) continue;

    for (const el of card.querySelectorAll("*")) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      const s = getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden" || parseFloat(s.opacity) < 0.05) continue;
      if (s.position === "fixed") continue;

      const spillRight = rect.right - cardRect.right;
      const spillLeft = cardRect.left - rect.left;
      if ((spillRight > 3 || spillLeft > 3) && !clippedHorizontally(el, card)) {
        findings.push({
          type: "card-spill",
          card: describe(card),
          el: describe(el),
          spillRight: Math.round(spillRight),
          spillLeft: Math.round(spillLeft),
        });
        if (findings.length > 12) return findings;
      }
    }
  }

  // Content overflow: any container whose children spill past its right
  // edge while overflow is visible (catches spills past inner panels too).
  // Threshold 12px skips intentional -mx-2/-mx-3 hover-row extensions.
  for (const el of document.querySelectorAll("main *")) {
    // The article column and prose wrapper intentionally let labs break out
    // to 1200px (centered overhang) — not a defect.
    if (el.classList.contains("prose") || el.classList.contains("max-w-[820px]")) continue;
    const s = getComputedStyle(el);
    if (s.overflowX !== "visible" || s.display === "inline") continue;
    if (el.clientWidth === 0) continue;
    if (el.scrollWidth > el.clientWidth + 12) {
      const parent = el.parentElement ? describe(el.parentElement) : "";
      findings.push({
        type: "content-overflow",
        el: describe(el),
        parent,
        overflowPx: el.scrollWidth - el.clientWidth,
      });
      if (findings.length > 12) return findings;
    }
  }
  return findings;
};

const browser = await chromium.launch();
let totalFindings = 0;

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();

  for (const path of pages) {
    try {
      await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(900); // let entrance animations settle
      const findings = await page.evaluate(auditScript);
      if (findings.length) {
        totalFindings += findings.length;
        console.log(`\n[${vp.width}px] ${path}`);
        for (const f of findings) console.log("  ", JSON.stringify(f));
      }
    } catch (e) {
      totalFindings++;
      console.log(`\n[${vp.width}px] ${path} ERROR: ${e.message.split("\n")[0]}`);
    }
  }
  await ctx.close();
}

await browser.close();
console.log(`\n=== Total findings: ${totalFindings} ===`);
process.exit(totalFindings > 0 ? 1 : 0);
