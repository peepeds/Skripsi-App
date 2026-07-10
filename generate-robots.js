import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const siteUrl = process.env.VITE_SITE_URL;

if (!siteUrl) {
  throw new Error("VITE_SITE_URL is not defined");
}

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

fs.writeFileSync("public/robots.txt", robots);

console.log("robots.txt generated");