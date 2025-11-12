import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"; // TODO: set real domain
	const routes = ["", "/projects", "/writing", "/about", "/contact", "/resume"].map((path) => ({
		url: `${baseUrl}${path || "/"}`,
		lastModified: new Date(),
	}));
	return routes;
}


