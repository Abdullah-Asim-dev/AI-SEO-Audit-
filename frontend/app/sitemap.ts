import type { MetadataRoute } from "next";

// Change to your custom domain once you have one.
const siteUrl = "https://seo-audit-tool-five-tau.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    // Add each new tool page here, e.g. `${siteUrl}/meta-description-checker`
  ];
}