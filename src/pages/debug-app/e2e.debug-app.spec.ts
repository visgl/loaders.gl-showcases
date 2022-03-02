import puppeteer from "puppeteer";

describe("ViewerApp", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/#/debug");
    await page.waitForSelector("#view-minimap")
  });

  afterAll(() => browser.close());

  it("Contains tool bar and minimap", async () => {
    await page.waitForSelector("#tool-bar");
    await page.waitForSelector("#view-minimap");
  });

  it("Select Map tab works", async () => {
    const controlOptions = [
        "New York",
        "San Francisco v1.6",
        "San Francisco v1.7",
        'Building'
      ];

    await page.waitForSelector("#control-panel");
    await page.select("#base-map", "Light");

    for await (const item of controlOptions) {
     const tileset = await page.select('#tilesets', item);    
       expect(tileset).toEqual([item])
        if (tileset.includes("Building")) {
        await page.waitForSelector("#building-explorer");
        await page.click("#BuildingExplorerToggle~span");
        await page.click("#CheckBox220-icon");
        await page.click("#CheckBox230-icon");
        await page.click("#CheckBox240-icon");
      }
    }
    
    await page.click("#BuildingExplorerToggle~span");
    await page.click("#terrain-layer-switch~span");
    await page.click("#select-map");
  });

  it('Map Info tab works', async () => {
    await page.click("#map-info");
    await page.waitForSelector("#map-info-panel", {visible: true});
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
    await page.click("#boundingVolume~span");
  });
});
