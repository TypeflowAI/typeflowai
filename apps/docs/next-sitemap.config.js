/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://typeflowai.com",
  generateRobotsTxt: true, // (optional)
  transform: async (config, path) => {
    const newPath = `/docs${path}`;
    return {
      loc: `${config.siteUrl}${newPath}`, // `loc` is the path of the URL
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
