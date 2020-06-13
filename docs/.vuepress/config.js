module.exports = {
  title: "HelloWorld Machida",
  themeConfig: {
    sidebar: ["/page1", "/page2", "/page3"],
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: {
    "@vuepress/back-to-top": {},
    "@vuepress/medium-zoom": {},
    "@vuepress/pwa": {
      serviceWorker: true,
      updatePopup: true,
    },
    seo: {},
  },
  head: [["link", { rel: "manifest", href: "/manifest.json" }]],
};
