import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://aequitally.com";
	const currentDate = new Date().toISOString();

	return [
		{
			url: baseUrl,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: currentDate,
			changeFrequency: "yearly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/privacy`,
			lastModified: currentDate,
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: `${baseUrl}/terms`,
			lastModified: currentDate,
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: `${baseUrl}/cookies`,
			lastModified: currentDate,
			changeFrequency: "yearly",
			priority: 0.5,
		},
	];
}
