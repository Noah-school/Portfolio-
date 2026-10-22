import { preview } from "astro";
import puppeteer from "puppeteer-core";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = `${root}public/Noah-Verstraeten-Resume.pdf`;

const server = await preview({ root, server: { port: 4488 }, logLevel: "error" });
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME ?? "/usr/bin/google-chrome",
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${server.port}/cv/`, { waitUntil: "networkidle0" });
  await page.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true });
  console.log(`Wrote ${out}`);
} finally {
  await browser.close();
  await server.stop();
}
