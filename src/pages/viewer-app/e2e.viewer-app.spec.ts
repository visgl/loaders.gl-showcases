import puppeteer, { type Browser, type Page } from "puppeteer";
import {
  checkLayersPanel,
  inserAndDeleteLayer,
} from "../../utils/testing-utils/e2e-layers-panel";

describe("Viewer", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.setDefaultTimeout(10000);
    await page.setViewport({ width: 1366, height: 768 });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/viewer");
  });

  afterAll(async () => {
    await browser.close();
  });

  it("Should automatically redirect from to the initial layer", async () => {
    const currentUrl = page.url();
    expect(currentUrl).toContain(
      "http://localhost:3000/viewer?tileset=san-francisco-v1_7"
    );
  });

  it("Should activate 'Viewer' menu item", async () => {
    expect(
      await page.$eval(
        "#header-links-default>a[active='1']",
        (node) => node.textContent
      )
    ).toEqual("Viewer");
  });
});

describe("Viewer - Main tools panel", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/viewer");
    await page.click("#map-control-panel>div:first-child");
  });

  afterAll(async () => {
    await browser.close();
  });

  it("Should show Main tools panel", async () => {
    expect(await page.$$("#viewer--tools-panel")).toBeDefined();
    const panel = await page.$("#viewer--tools-panel");
    const panelChildren = await panel?.$$(":scope > *");
    expect(panelChildren?.length).toEqual(3);
  });

  it("Should open layers panel", async () => {
    expect(await page.$("#viewer--layers-panel")).toBeNull();
    const layersPanelButton = await page.$(
      "#viewer--tools-panel>button:first-child"
    );
    await layersPanelButton?.click();
    expect(await page.$("#viewer--layers-panel")).toBeDefined();

    await layersPanelButton?.click();
    expect(await page.$("#viewer--layers-panel")).toBeNull();
  });

  it("Memory Usage tab works", async () => {
    await page.click("#memory-usage-tab");
    await page.waitForSelector("#viewer-memory-usage-panel", {
      visible: true,
    });
  });

  it("Bookmarks tab works", async () => {
    await page.click("#bookmarks-tab");
    await page.waitForSelector("#viewer-bookmarks-panel", { visible: true });
  });
});

describe("Viewer - Layers panel", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.setDefaultTimeout(10000);
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/viewer");
    const layersPanelButton = await page.$(
      "#viewer--tools-panel>button:first-child"
    );
    await layersPanelButton?.click();
  });

  it("Should close layers panel", async () => {
    const closeButton = await page.$("#layers-panel-close-button");
    await closeButton?.click();
    expect(await page.$("#viewer--layers-panel")).toBeNull();
  });

  it("Should show layers panel", async () => {
    const panelId = "#viewer--layers-panel";
    await page.waitForSelector(panelId);
    expect(await page.$$(panelId)).toBeDefined();
    await checkLayersPanel(page, panelId, true);
  }, 30000);

  it("Should select initial layer", async () => {
    expect(
      await page.$eval(
        "#viewer--layers-panel #san-francisco-v1_7>input",
        (node) => node.checked
      )
    ).toBeTruthy();
  });

  it("Should insert and delete layers", async () => {
    await inserAndDeleteLayer(
      page,
      "#viewer--layers-panel",
      "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/Rancho_Mesh_mesh_v17_1/SceneServer/layers/0"
    );
  }, 60000);
});

const chevronSvgHtml =
  "<path d=\"M.58 6c0-.215.083-.43.247-.594l5.16-5.16a.84.84 0 1 1 1.188 1.189L2.609 6l4.566 4.566a.84.84 0 0 1-1.189 1.188l-5.16-5.16A.838.838 0 0 1 .581 6Z\"></path>";
const plusSvgHtml = "<path d=\"M14 8H8v6H6V8H0V6h6V0h2v6h6v2Z\"></path>";
const minusSvgHtml = "<path d=\"M14 2H0V0h14v2Z\"></path>";
const panSvgHtml =
  "<path d=\"M10 .5 6 5h8L10 .5ZM5 6 .5 10 5 14V6Zm10 0v8l4.5-4L15 6Zm-5 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-4 7 4 4.5 4-4.5H6Z\"></path>";
const orbitSvgHtml =
  "<path d=\"M0 9a9 9 0 0 0 9 9c2.39 0 4.68-.94 6.4-2.6l-1.5-1.5A6.706 6.706 0 0 1 9 16C2.76 16-.36 8.46 4.05 4.05 8.46-.36 16 2.77 16 9h-3l4 4h.1L21 9h-3A9 9 0 0 0 0 9Z\"></path>";
const compasSvgHtml =
  "<path d=\"M0 12 6 0l6 12H0Z\" fill=\"#F95050\"></path><path d=\"M12 12 6 24 0 12h12Z\"></path>";

describe("Viewer - Map Control Panel", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.setDefaultTimeout(10000);
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/viewer");
  });

  afterAll(async () => {
    await browser.close();
  });

  it("Should show", async () => {
    const panelId = "#map-control-panel";

    // Dropdown button
    const dropdownButton = await page.$eval(
      `${panelId} > :first-child > :first-child > svg`,
      (node) => node.innerHTML
    );
    expect(dropdownButton).toBe(chevronSvgHtml);

    // Control buttons
    const controlButtons = await page.$$eval(
      `${panelId} > button svg`,
      (nodes) => nodes.map((node) => node.innerHTML)
    );
    expect(controlButtons).toEqual([
      plusSvgHtml,
      minusSvgHtml,
      panSvgHtml,
      orbitSvgHtml,
      compasSvgHtml,
    ]);
  });
});
