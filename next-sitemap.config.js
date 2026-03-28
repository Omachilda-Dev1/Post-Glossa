/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://postglossa.com";
const locales = ["en", "fr", "de", "es", "pt", "ja", "zh"];

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
  alternateRefs: locales.map((loc) => ({
    href: `${siteUrl}/${loc}`,
    hreflang: loc,
  })),
};
