import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://seo-audit-tool-five-tau.vercel.app/sitemap.xml",
  };
}