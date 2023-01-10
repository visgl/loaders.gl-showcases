import puppeteer from "puppeteer";

describe("ViewerApp", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/viewer");
  });

  afterAll(() => browser.close());

  it("Memory Usage tab works", async () => {
    await page.click("#memory-usage-tab");
    await page.waitForSelector("#viewer-memory-usage-panel", { visible: true });
  });

  it("Memory Usage tab works", async () => {
    await page.click("#bookmarks-tab");
    await page.waitForSelector("#viewer-bookmarks-panel", { visible: true });
  });
});
