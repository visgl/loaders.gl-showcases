module.exports = {
  launch: {
    headless: true,
    ignoreDefaultArgs: ['--disable-extensions'],
    args: ['--no-sandbox'],
  },
  server: {
    command: 'yarn serve build',
    port: 3000,
    // launchTimeout: 180000,
  },
};
