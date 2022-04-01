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
    expect(currentUrl).toBe("http://localhost:3000/dashboard");
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
    ).toEqual(["Home", "Viewer", "Debug", "Comparison", "GitHub"]);
  });

  it("Contains dashboard canvas", async () => {
    await page.waitForSelector("#dashboard-app");

    const dashboardCanvas = await page.$$("#dashboard-app");
    expect(dashboardCanvas).toBeDefined();
  });

  it("Should go to the Viewer page", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("#header-links");
    await page.click("a[href='/viewer']");
    const currentUrl = page.url();
    expect(currentUrl).toBe("http://localhost:3000/viewer");
    const controlPanel = await page.$$("#control-panel");
    expect(controlPanel).toBeDefined();
  });

  it("Should go to the Debug page", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("#header-links");
    await page.click("a[href='/debug']");
    const currentUrl = page.url();
    expect(currentUrl).toBe("http://localhost:3000/debug");
    const toolBar = await page.$$("#tool-bar");
    expect(toolBar).toBeDefined();
  });

  it("Should go to the Comparison page", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("#header-links");
    await page.click("a[href='/comparison']");
    const currentUrl = page.url();
    expect(currentUrl).toBe("http://localhost:3000/comparison");
  });

  it("Should go to the project GitHub page", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("#header-links");
    await page.click("a[href='https://github.com/visgl/loaders.gl-showcases']");
    const currentUrl = page.url();
    expect(currentUrl).toBe("https://github.com/visgl/loaders.gl-showcases");
  });

  it("Should return from viewer page to Dashboard", async () => {
    await page.goto("http://localhost:3000/viewer");
    await page.waitForSelector("#header-links");
    await page.click("a[href='/dashboard']");
    const currentUrl = page.url();
    expect(currentUrl).toBe("http://localhost:3000/dashboard");
    const dashboardCanvas = await page.$$("#dashboard-app");
    expect(dashboardCanvas).toBeDefined();
  });
});
