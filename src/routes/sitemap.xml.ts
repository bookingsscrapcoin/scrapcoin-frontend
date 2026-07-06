import { createServerFileRoute } from "@tanstack/react-start/server";

const SITE_URL = "https://scrapco.in";

// All public pages with their priorities and change frequencies
const PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/rates", priority: "0.9", changefreq: "weekly" },
  { path: "/faq", priority: "0.8", changefreq: "monthly" },
  { path: "/contact", priority: "0.8", changefreq: "monthly" },
  { path: "/partner", priority: "0.7", changefreq: "monthly" },
  { path: "/impact", priority: "0.7", changefreq: "weekly" },
  { path: "/blog", priority: "0.6", changefreq: "weekly" },
  { path: "/careers", priority: "0.6", changefreq: "monthly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
];

export const ServerRoute = createServerFileRoute("/sitemap.xml").methods({
  GET: () => {
    const lastmod = new Date().toISOString().split("T")[0];

    const urls = PAGES.map(
      ({ path, priority, changefreq }) => `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
    ).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
});
