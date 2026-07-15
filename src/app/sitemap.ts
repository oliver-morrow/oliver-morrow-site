import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://olivermorrow.com",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
