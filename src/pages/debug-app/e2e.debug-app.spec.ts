import puppeteer from "puppeteer";

describe("DebugApp", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/debug");
  });

  afterAll(() => browser.close());

  // Test is failing on GitHub
  it.skip("Contains tool bar and minimap", async () => {
    await page.waitForSelector("#tool-bar");
    await page.waitForSelector("#view-minimap");
  });

  it("Memory Usage tab works", async () => {
    await page.click("#memory-usage");
    await page.waitForSelector("#stats-widget", {visible: true});
  });

  it("Validator tab works", async () => {
    await page.click("#validator");
    await page.waitForSelector("#semantic-validator");
  });

  it("Debug panel works", async () => {
    await page.click("#debug-panel");
    await page.click("#showFrustumCullingMinimapViewport-icon");
    await page.click("#showFrustumCullingMinimap~span");
    await page.waitForSelector("#view-minimap", {hidden: true});
    await page.click("#pickable-icon");
    await page.click("#uvDebugTexture-icon");
    await page.click("#wireframe-icon");
    const tileColorOptions = await page.$$eval("#color > option", options =>
      options.map(option => option.textContent)
    );
    expect(tileColorOptions).toEqual([ "Original", "Random by tile", "By depth", "User selected"])
    for await (const [index] of tileColorOptions.entries()) {
      await page.select("#color", String(index));   
    }

    await page.hover("#boundingVolume~span");
    await page.click("#boundingVolume~span");

    const volumeTypeOptionsText = await page.$$eval("#volume-type > option", options =>
      options.map(option => option.textContent)
    );
    const volumeTypeOptionsValue = await page.$$eval("#volume-type > option", options =>
      options.map(option => option.value)
    );
    expect(volumeTypeOptionsText).toEqual(["MBS", "OBB"])
    for await (const item of volumeTypeOptionsValue) {
      await page.select('#volume-type', item);   
    }

    const volumeColorOptionsText = await page.$$eval("#volume-color > option", options =>
      options.map(option => option.textContent)
    );
    const volumeColorOptionsValue = await page.$$eval("#volume-color > option", options =>
      options.map(option => option.value)
    );
    expect(volumeColorOptionsText).toEqual(["White", "By tile"])
    for await (const item of volumeColorOptionsValue) {
      await page.select("#volume-color", item);   
    }
  }, 40000);
});
