import puppeteer from "puppeteer";

describe("Comparison", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/comparison");
  });

  afterAll(() => browser.close());

  it("Contains two canvases", async () => {
    await page.waitForSelector("#first-deck-container");
    await page.waitForSelector("#second-deck-container");

    expect(await page.$$("#first-deck-container")).toBeDefined();
    expect(await page.$$("#second-deck-container")).toBeDefined();
  });
});
