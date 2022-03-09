module.exports = {
  launch: {
    // Disable headless mode if you want to run test with browser.
    headless: true,
    ignoreDefaultArgs: ["--disable-extensions"],
    args: ["--no-sandbox"],
  },
  server: {
    command: "yarn serve -c serve.config.json",
    port: 3000,
    launchTimeout: 180000,
  },
};
