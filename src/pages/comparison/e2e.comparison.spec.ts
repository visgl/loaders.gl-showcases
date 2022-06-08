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
    await page.waitForSelector("#tools-panel-left");

    expect(await page.$$("#tools-panel-left")).toBeDefined();

    const panel = await page.$('#tools-panel-left');
    const panelChildren = await panel.$$(':scope > *');

    expect(panelChildren.length).toEqual(2);
  });

  it("Right panel should be present", async () => {
    await page.waitForSelector("#tools-panel-right");
    expect(await page.$$("#tools-panel-right")).toBeDefined();

    const panel = await page.$('#tools-panel-right');
    const panelChildren = await panel.$$(':scope > *');

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
    await page.waitForSelector("#tools-panel-left");

    expect(await page.$$("#tools-panel-left")).toBeDefined();

    const panel = await page.$('#tools-panel-left');
    const panelChildren = await panel.$$(':scope > *');

    expect(panelChildren.length).toEqual(3);
  });

  it("Right panel should be present", async () => {
    await page.waitForSelector("#tools-panel-right");
    expect(await page.$$("#tools-panel-right")).toBeDefined();

    const panel = await page.$('#tools-panel-right');
    const panelChildren = await panel.$$(':scope > *');

    expect(panelChildren.length).toEqual(2);
  });
});

