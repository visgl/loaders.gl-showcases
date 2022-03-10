import puppeteer from "puppeteer";

describe("AboutUs", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/#/about-us");
  });

  afterAll(() => browser.close());

  it("Contains construction info", async () => {
    await page.waitForSelector("#construction-info");
    await page.waitForSelector("#construction-title");
  });
});
