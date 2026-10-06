import type { MetadataRoute } from "next";

const siteUrl = "https://seo-audit-tool-five-tau.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}