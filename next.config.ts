import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* Core config options */
	typedRoutes: true,
	experimental: {
		reactCompiler: true,
	},

	/* Performance optimizations */
	compress: true,
	poweredByHeader: false,

	/* Image optimization */
	images: {
		formats: ["image/webp", "image/avif"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60,
	},

	/* Security and SEO headers */
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
					{
						key: "Referrer-Policy",
						value: "origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
				],
			},
			// Cache headers for static assets
			{
				source: "/favicon.ico",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		];
	},

	/* Redirects for SEO */
	async redirects() {
		return [
			// Add any necessary redirects here
			// Example: redirect old URLs to new ones
		];
	},
};

export default nextConfig;
