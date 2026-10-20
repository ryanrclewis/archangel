import type { MetadataRoute } from "next";
import siteConfig from "./data/site-config.json";
import { projects } from "./data/projects";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteConfig.siteUrl }, { url: `${siteConfig.siteUrl}/archive` }, { url: `${siteConfig.siteUrl}/about` }, { url: `${siteConfig.siteUrl}/bespoke` }, { url: `${siteConfig.siteUrl}/writing` }, { url: `${siteConfig.siteUrl}/system` }, ...projects.map((project) => ({ url: `${siteConfig.siteUrl}/projects/${project.id}` }))];
}
