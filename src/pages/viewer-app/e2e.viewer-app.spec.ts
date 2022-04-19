import puppeteer from "puppeteer";

describe("ViewerApp", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000/viewer");
  });

  afterAll(() => browser.close());

  it("Contains control panel", async () => {
    const controlOptions = [
      "san-francisco-v1.7",
      "new-york",
      "san-francisco-v1.6",
    ];
    const controlUrls = [
      "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_3DObjects_1_7/SceneServer/layers/0",
      "https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Buildings_NewYork_17/SceneServer/layers/0",
      "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0",
    ];

    await page.waitForSelector("#control-panel");
    await page.select("#base-map", "Light");

    for await (const [index, item] of controlOptions.entries()) {
      expect(await page.select("#tilesets", item)).toEqual([item]);
      expect(
        await page.$eval("#stats-panel", e =>
          e.lastChild.firstChild.textContent.slice(2)
        )
      ).toBe(controlUrls[index]);
    }

    await page.click("#terrain-layer-switch~span");
  });

  it("Contains building explorer", async () => {
    await page.select("#tilesets", "building");
    await page.waitForSelector("#building-explorer");
    await page.click("#BuildingExplorerToggle~span");
    await page.click("#CheckBox220-icon");
    await page.click("#CheckBox230-icon");
    await page.click("#CheckBox240-icon");
  }, 40000);

  it("Contains statistic panel", async () => {
    await page.waitForSelector("#stats-panel");
  });
});
