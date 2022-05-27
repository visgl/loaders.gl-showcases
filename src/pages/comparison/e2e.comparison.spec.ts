import puppeteer from "puppeteer";

describe("Compare pages", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000");
  });

  afterAll(() => browser.close());

  it("Compare Across Layers Page should be present", async () => {
    await page.goto("http://localhost:3000/compare-across-layers");

    await page.waitForSelector("#first-deck-container");
    await page.waitForSelector("#second-deck-container");

    expect(await page.$$("#first-deck-container")).toBeDefined();
    expect(await page.$$("#second-deck-container")).toBeDefined();

    const currentUrl = page.url();
    expect(currentUrl).toBe("http://localhost:3000/compare-across-layers");
  });

  it("Compare Within Layer Page should be present", async () => {
    await page.goto("http://localhost:3000/compare-within-layer");

    await page.waitForSelector("#first-deck-container");
    await page.waitForSelector("#second-deck-container");

    expect(await page.$$("#first-deck-container")).toBeDefined();
    expect(await page.$$("#second-deck-container")).toBeDefined();

    const currentUrl = page.url();
    expect(currentUrl).toBe("http://localhost:3000/compare-within-layer");
  });
});
