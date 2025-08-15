module.exports = {
  globDirectory: "dist/",
  globPatterns: ["**/*.{js,css,html,svg,png,json}"],
  swDest: "dist/sw.js",
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.destination === "document",
      handler: "NetworkFirst",
    },
    {
      urlPattern: ({ request }) =>
        ["style", "script", "worker"].includes(request.destination),
      handler: "StaleWhileRevalidate",
    },
  ],
};
