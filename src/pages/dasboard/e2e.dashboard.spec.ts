import puppeteer from "puppeteer";

describe("Dashboard", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
  });

  afterAll(() => browser.close());

  it("Should automatically redirect from '/' path", async () => {
    const currentUrl = page.url();
    expect(currentUrl).toBe("http://localhost:3000/#/dashboard");
  });

  it("Contains header", async () => {
    await page.waitForSelector("#header-logo");
    const text = await page.$eval("#header-logo", (e) => e.textContent);
    expect(text).toContain("I3S Explorer");
  });

  it("Contains page links", async () => {
    await page.waitForSelector("#header-links");

    const linksParent = await page.$("#header-links");
    expect(
      await linksParent.$$eval("a", (nodes) => nodes.map((n) => n.innerText))
    ).toEqual(["Home", "Viewer", "Debug", "Comparison", "About Us"]);
  });

  it("Contains dashboard canvas", async () => {
    await page.waitForSelector("#dashboard-app");

    const dashboardCanvas = await page.$$("#dashboard-app");
    expect(dashboardCanvas).toBeDefined();
  });

  it("Should go to the Viewer page", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("#header-links");
    await page.click("a[href='#/viewer']");
    const currentUrl = page.url();
    expect(currentUrl).toBe("http://localhost:3000/#/viewer");
  });

  it("Should go to the Debug page", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("#header-links");
    await page.click("a[href='#/debug']");
    const currentUrl = page.url();
    expect(currentUrl).toBe("http://localhost:3000/#/debug");
  });

  it("Should go to the Comparison page", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("#header-links");
    await page.click("a[href='#/comparison']");
    const currentUrl = page.url();
    expect(currentUrl).toBe("http://localhost:3000/#/comparison");
  });

  it("Should go to the About Us page", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("#header-links");
    await page.click("a[href='#/about-us']");
    const currentUrl = page.url();
    expect(currentUrl).toBe("http://localhost:3000/#/about-us");
  });
});
