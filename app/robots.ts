import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: ["/", "/about", "/privacy", "/terms", "/cookies"],
				disallow: ["/api/", "/_next/", "/convex/", "/admin/", "/dashboard/"],
			},
			{
				userAgent: "GPTBot",
				disallow: "/",
			},
			{
				userAgent: "ChatGPT-User",
				disallow: "/",
			},
			{
				userAgent: "Google-Extended",
				disallow: "/",
			},
		],
		sitemap: "https://aequitally.com/sitemap.xml",
		host: "https://aequitally.com",
	};
}
