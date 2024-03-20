import puppeteer, { type Page } from "puppeteer";
import { configurePage } from "../../utils/testing-utils/configure-tests";

describe("Auth page Default View", () => {
  let browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await configurePage(page);
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto("http://localhost:3000");
  });

  afterAll(() => browser.close());

  it("Should render the page", async () => {
    const authPageUrl = "http://localhost:3000/auth";

    await page.goto(authPageUrl);
    const currentUrl = page.url();
    expect(currentUrl).toBe(authPageUrl);
  });
});
