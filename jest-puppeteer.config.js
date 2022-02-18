module.exports = {
  launch: {
    headless: process.env.CI === 'true',
    ignoreDefaultArgs: ['--disable-extensions'],
    args: ['--no-sandbox'],
  },
  server: {
    command: 'yarn serve build',
    port: 3000,
    // launchTimeout: 180000,
  },
};
