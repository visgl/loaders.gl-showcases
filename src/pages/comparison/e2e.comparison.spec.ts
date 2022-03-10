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

  it("Contains construction info", async () => {
    await page.waitForSelector("#construction-info");
    await page.waitForSelector("#construction-title");
    const text = await page.$eval("#construction-title", (e) => e.textContent);
    expect(text).toEqual("We are working on it ...")
  }, 20000);
});
