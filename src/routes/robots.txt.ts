import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute("/robots.txt").methods({
  GET: () => {
    const robots = [
      "User-agent: *",
      "Allow: /",
      "",
      "Disallow: /admin/",
      "Disallow: /erp/",
      "Disallow: /my-bookings",
      "Disallow: /login",
      "Disallow: /register",
      "",
      `Sitemap: https://scrapco.in/sitemap.xml`,
    ].join("\n");

    return new Response(robots, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    });
  },
});
