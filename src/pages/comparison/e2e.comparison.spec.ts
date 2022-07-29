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

    await page.waitForSelector("#left-deck-container");
    await page.waitForSelector("#right-deck-container");

    expect(await page.$$("#left-deck-container")).toBeDefined();
    expect(await page.$$("#right-deck-container")).toBeDefined();

    const currentUrl = page.url();
    expect(currentUrl).toBe("http://localhost:3000/compare-across-layers");
  });

  it("Compare Within Layer Page should be present", async () => {
    await page.goto("http://localhost:3000/compare-within-layer");

    await page.waitForSelector("#left-deck-container");
    await page.waitForSelector("#right-deck-container");

    expect(await page.$$("#left-deck-container")).toBeDefined();
    expect(await page.$$("#right-deck-container")).toBeDefined();

    const currentUrl = page.url();
    expect(currentUrl).toBe("http://localhost:3000/compare-within-layer");
  });
});

describe("Main tools panel Across Layers mode", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/compare-across-layers");
  });

  afterAll(() => browser.close());

  it("Left panel should be present", async () => {
    await page.waitForSelector("#left-tools-panel");

    expect(await page.$$("#left-tools-panel")).toBeDefined();

    const panel = await page.$("#left-tools-panel");
    const panelChildren = await panel.$$(":scope > *");

    expect(panelChildren.length).toEqual(2);
  });

  it("Right panel should be present", async () => {
    await page.waitForSelector("#right-tools-panel");
    expect(await page.$$("#right-tools-panel")).toBeDefined();

    const panel = await page.$("#right-tools-panel");
    const panelChildren = await panel.$$(":scope > *");

    expect(panelChildren.length).toEqual(2);
  });
});

describe("Main tools panel Within Layer mode", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/compare-within-layer");
  });

  afterAll(() => browser.close());

  it("Left panel should be present", async () => {
    await page.waitForSelector("#left-tools-panel");

    expect(await page.$$("#left-tools-panel")).toBeDefined();

    const panel = await page.$("#left-tools-panel");
    const panelChildren = await panel.$$(":scope > *");

    expect(panelChildren.length).toEqual(3);
  });

  it("Right panel should be present", async () => {
    await page.waitForSelector("#right-tools-panel");
    expect(await page.$$("#right-tools-panel")).toBeDefined();

    const panel = await page.$("#right-tools-panel");
    const panelChildren = await panel.$$(":scope > *");

    expect(panelChildren.length).toEqual(2);
  });
});
