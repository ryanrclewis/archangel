import type { MetadataRoute } from "next";
import siteConfig from "./data/site-config.json";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteConfig.siteUrl}/sitemap.xml` }; }
