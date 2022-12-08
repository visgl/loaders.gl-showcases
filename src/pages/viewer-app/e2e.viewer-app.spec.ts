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

  it("Contains statistic panel", async () => {
    await page.waitForSelector("#stats-panel");
  });
});
