import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://sensestamp.com", lastModified: new Date("2026-09-28"), changeFrequency: "weekly", priority: 1 },
  ];
}
