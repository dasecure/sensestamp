import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://sensestamp.com", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://sensestamp.com/privacy", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
