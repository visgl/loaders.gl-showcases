import puppeteer, { type Page } from "puppeteer";

import {
  checkLayersPanel,
  insertAndDeleteLayer,
} from "../../utils/testing-utils/e2e-layers-panel";
import { PageId } from "../../types";
import { configurePage } from "../../utils/testing-utils/configure-tests";

describe("Compare", () => {
  let browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await configurePage(page);
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000");
  });

  afterAll(() => browser.close());

  it("Compare Across Layers Page should be present", async () => {
    await page.goto("http://localhost:3000/compare-across-layers");

    await page.waitForSelector("#left-deck-container");
    await page.waitForSelector("#right-deck-container");

    expect(await page.$("#left-deck-container")).not.toBeNull();
    expect(await page.$("#right-deck-container")).not.toBeNull();

    const currentUrl = page.url();
    expect(currentUrl).toBe("http://localhost:3000/compare-across-layers");
  });

  it("Compare Within Layer Page should be present", async () => {
    await page.goto("http://localhost:3000/compare-within-layer");

    await page.waitForSelector("#left-deck-container");
    await page.waitForSelector("#right-deck-container");

    expect(await page.$("#left-deck-container")).not.toBeNull();
    expect(await page.$("#right-deck-container")).not.toBeNull();

    const currentUrl = page.url();
    expect(currentUrl).toBe("http://localhost:3000/compare-within-layer");
  });
});

describe("Compare - Main tools panel Across Layers mode", () => {
  let browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await configurePage(page);
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/compare-across-layers");
  });

  afterAll(() => browser.close());

  it("Left panel should be present", async () => {
    await page.waitForSelector("#left-tools-panel");

    expect(await page.$("#left-tools-panel")).not.toBeNull();

    const panel = await page.$("#left-tools-panel");
    expect(panel).not.toBeNull();

    if (!panel) {
      return;
    }

    const panelChildren = await panel.$$(":scope > *");

    expect(panelChildren.length).toEqual(3);
  });

  it("Right panel should be present", async () => {
    await page.waitForSelector("#right-tools-panel");
    const panel = await page.$("#right-tools-panel");
    expect(panel).not.toBeNull();

    if (!panel) {
      return;
    }

    const panelChildren = await panel.$$(":scope > *");

    expect(panelChildren.length).toEqual(3);
  });
});

describe("Compare - Main tools panel Within Layer mode", () => {
  let browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await configurePage(page);
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/compare-within-layer");
  });

  afterAll(() => browser.close());

  it("Left panel should be present", async () => {
    await page.waitForSelector("#left-tools-panel");

    const panel = await page.$("#left-tools-panel");
    expect(panel).not.toBeNull();

    if (!panel) {
      return;
    }

    const panelChildren = await panel.$$(":scope > *");

    expect(panelChildren.length).toEqual(4);
  });

  it("Right panel should be present", async () => {
    await page.waitForSelector("#right-tools-panel");

    const panel = await page.$("#right-tools-panel");
    expect(panel).not.toBeNull();

    if (!panel) {
      return;
    }
    const panelChildren = await panel.$$(":scope > *");

    expect(panelChildren.length).toEqual(3);
  });
});

describe("Compare - Layers Panel Across Layers mode", () => {
  let browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await configurePage(page);
    await page.setViewport({ width: 1366, height: 768 });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/compare-across-layers");
  });

  afterAll(() => browser.close());

  it("Should show left layers panel", async () => {
    const panelId = "#left-layers-panel";
    await page.waitForSelector(panelId);
    expect(await page.$(panelId)).not.toBeNull();
    await checkLayersPanel(page, panelId, undefined, PageId.comparison);
  });

  it("Should show right layers panel", async () => {
    const panelId = "#right-layers-panel";
    await page.waitForSelector(panelId);
    expect(await page.$(panelId)).not.toBeNull();
    await checkLayersPanel(page, panelId, undefined, PageId.comparison);
  });

  it("Should select layers", async () => {
    // Select San Francisco v1.7 on left side
    const sfLayer = await page.$(
      "#left-layers-panel > :nth-child(4) > :first-child > :first-child > :nth-child(2)"
    );
    expect(sfLayer).not.toBeNull();

    if (!sfLayer) {
      return;
    }

    await sfLayer.click();
    const selectedLayer = await page.$(
      "#left-layers-panel > :nth-child(4) > :first-child > :first-child input:checked"
    );
    expect(selectedLayer).not.toBeNull();
    let selectedLayerRight = await page.$(
      "#right-layers-panel > :nth-child(4) > :first-child > :first-child input:checked"
    );
    expect(selectedLayerRight).toBeNull();
    const sfLayerInputChecked = await page.$eval(
      "#left-layers-panel > :nth-child(4) > :first-child > :first-child > :nth-child(2) input",
      (node) => node.checked
    );
    expect(sfLayerInputChecked).toBe(true);

    // Select Building on right side
    const buldingLayer = await page.$(
      "#right-layers-panel > :nth-child(4) > :first-child > :first-child > :nth-child(4)"
    );
    expect(buldingLayer).not.toBeNull();

    if (!buldingLayer) {
      return;
    }

    await buldingLayer.hover();
    await buldingLayer.click();
    selectedLayerRight = await page.$(
      "#right-layers-panel > :nth-child(4) > :first-child > :first-child input:checked"
    );
    expect(selectedLayerRight).not.toBeNull();
    const buldingLayerInputChecked = await page.$eval(
      "#right-layers-panel > :nth-child(4) > :first-child > :first-child > :nth-child(4) input",
      (node) => node.checked
    );
    expect(sfLayerInputChecked).toBe(true);
    expect(buldingLayerInputChecked).toBe(true);
  });

  it("Should insert and delete layer", async () => {
    await insertAndDeleteLayer(
      page,
      "#left-layers-panel",
      "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/Rancho_Mesh_mesh_v17_1/SceneServer/layers/0"
    );

    await insertAndDeleteLayer(
      page,
      "#right-layers-panel",
      "https://fake.layer.url"
    );
  });
});

describe("Compare - Layers Panel Within Layer mode", () => {
  let browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await configurePage(page);
    await page.setViewport({ width: 1366, height: 768 });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/compare-within-layer");
  });

  afterAll(() => browser.close());

  it("Should show left layers panel", async () => {
    const panelId = "#left-layers-panel";
    await page.waitForSelector(panelId);
    expect(await page.$(panelId)).not.toBeNull();
    await checkLayersPanel(page, panelId, undefined, PageId.comparison);
  });

  it("Shouldn't show right layers panel", async () => {
    const panelId = "#right-layers-panel";
    expect(await page.$(panelId)).toBeNull();
  });

  it("Should select layer", async () => {
    // Select New York on left side
    const sfLayer = await page.$(
      "#left-layers-panel > :nth-child(4) > :first-child > :first-child > :nth-child(3)"
    );
    expect(sfLayer).not.toBeNull();

    if (!sfLayer) {
      return;
    }

    await sfLayer.click();
    const selectedLayer = await page.$(
      "#left-layers-panel > :nth-child(4) > :first-child > :first-child input:checked"
    );
    expect(selectedLayer).not.toBeNull();
    const sfLayerInputChecked = await page.$eval(
      "#left-layers-panel > :nth-child(4) > :first-child > :first-child > :nth-child(3) input",
      (node) => node.checked
    );
    expect(sfLayerInputChecked).toBe(true);
  });
});

const chevronSvgHtml =
  "<path d=\"M.58 6c0-.215.083-.43.247-.594l5.16-5.16a.84.84 0 1 1 1.188 1.189L2.609 6l4.566 4.566a.84.84 0 0 1-1.189 1.188l-5.16-5.16A.84.84 0 0 1 .581 6\"></path>";
const plusSvgHtml = "<path d=\"M14 8H8v6H6V8H0V6h6V0h2v6h6z\"></path>";
const minusSvgHtml = "<path d=\"M14 2H0V0h14z\"></path>";
const panSvgHtml =
  "<path d=\"M10 .5 6 5h8zM5 6 .5 10 5 14zm10 0v8l4.5-4zm-5 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-4 7 4 4.5 4-4.5z\"></path>";
const orbitSvgHtml =
  "<path d=\"M0 9a9 9 0 0 0 9 9c2.39 0 4.68-.94 6.4-2.6l-1.5-1.5A6.7 6.7 0 0 1 9 16C2.76 16-.36 8.46 4.05 4.05S16 2.77 16 9h-3l4 4h.1L21 9h-3A9 9 0 0 0 0 9\"></path>";
const compasSvgHtml =
  "<path fill=\"#F95050\" d=\"M0 12 6 0l6 12z\"></path><path d=\"M12 12 6 24 0 12z\"></path>";

describe("Compare - Map Control Panel", () => {
  let browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await configurePage(page);
    await page.setViewport({ width: 1366, height: 768 });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/compare-within-layer");
  });

  afterAll(() => browser.close());

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

describe("Compare - Comparison Params Panel", () => {
  let browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await configurePage(page);
    await page.setViewport({ width: 1366, height: 768 });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/compare-within-layer");
  });

  afterAll(() => browser.close());

  const checkComparisonParamsPanel = async (panelId: string): Promise<void> => {
    // Header
    const headerText = await page.$eval(
      `${panelId} > :first-child > :first-child`,
      (node) => (node as HTMLElement).innerText
    );
    expect(headerText).toBe("Comparison parameters");

    // Close button
    const closeButtonIcon = await page.$(
      `${panelId} > :first-child > :nth-child(2) > :first-child`
    );
    expect(closeButtonIcon).not.toBeNull();

    if (!closeButtonIcon) {
      return;
    }

    expect(await closeButtonIcon.$(":scope::after")).toBeDefined();
    expect(await closeButtonIcon.$(":scope::before")).toBeDefined();

    // Horizontal Line
    expect(
      await page.$eval(
        `${panelId} > :nth-child(2)`,
        (node) => (node as HTMLElement).innerText
      )
    ).toBe("");

    // Draco
    const dracoParamText = await page.$eval(
      `${panelId} > :nth-child(3) > :first-child`,
      (node) => (node as HTMLElement).innerText
    );
    expect(dracoParamText).toBe("Draco compressed geometry");
    const dracoInputValue = await page.$eval(
      `${panelId} > :nth-child(3) input`,
      (node) => node.checked
    );
    expect(dracoInputValue).toBe(true);

    // Compressed textures
    const compressedTexturesParamText = await page.$eval(
      `${panelId} > :nth-child(4) > :first-child`,
      (node) => (node as HTMLElement).innerText
    );
    expect(compressedTexturesParamText).toBe("Compressed textures");
    const compressedTexturesInputValue = await page.$eval(
      `${panelId} > :nth-child(4) input`,
      (node) => node.checked
    );
    expect(compressedTexturesInputValue).toBe(true);
  };

  it("Should show left comparison params panel", async () => {
    const mainToolsPanelId = "#left-tools-panel";
    const comparisonParamsButton = await page.$(
      `${mainToolsPanelId} > button:nth-child(2)`
    );
    expect(comparisonParamsButton).not.toBeNull();
    if (!comparisonParamsButton) {
      return;
    }
    await comparisonParamsButton.click();
    await checkComparisonParamsPanel("#left-comparison-params-panel");
  });

  it("Should show right comparison params panel", async () => {
    const mainToolsPanelId = "#right-tools-panel";
    const comparisonParamsButton = await page.$(
      `${mainToolsPanelId} > button:nth-child(1)`
    );
    expect(comparisonParamsButton).not.toBeNull();
    if (!comparisonParamsButton) {
      return;
    }
    await comparisonParamsButton.click();
    await checkComparisonParamsPanel("#right-comparison-params-panel");
  });
});

describe("Compare - Statistics", () => {
  let browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await configurePage(page);
    await page.setViewport({ width: 1366, height: 768 });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/compare-within-layer");
  });

  afterAll(() => browser.close());

  const checkStatsticsPanel = async (panelId): Promise<void> => {
    // Header
    const headerText = await page.$eval(
      `${panelId} > :first-child > :first-child`,
      (node) => (node as HTMLElement).innerText
    );
    expect(headerText).toBe("Memory");

    // Close button
    const closeButtonIcon = await page.$(
      `${panelId} > :first-child > :nth-child(2) > :first-child`
    );
    expect(closeButtonIcon).not.toBeNull();
    if (!closeButtonIcon) {
      return;
    }
    expect(await closeButtonIcon.$(":scope::after")).toBeDefined();
    expect(await closeButtonIcon.$(":scope::before")).toBeDefined();

    // Horizontal Line
    expect(
      await page.$eval(
        `${panelId} > :nth-child(2)`,
        (node) => (node as HTMLElement).innerText
      )
    ).toBe("");
  };

  it("Should show left statistics panel", async () => {
    const mainToolsPanelId = "#left-tools-panel";
    const comparisonParamsButton = await page.$(
      `${mainToolsPanelId} > button:nth-child(3)`
    );
    expect(comparisonParamsButton).not.toBeNull();
    if (!comparisonParamsButton) {
      return;
    }
    await comparisonParamsButton.click();
    await checkStatsticsPanel("#left-memory-usage-panel");
  });

  it("Should show right statistics panel", async () => {
    const mainToolsPanelId = "#right-tools-panel";
    const comparisonParamsButton = await page.$(
      `${mainToolsPanelId} > button:nth-child(2)`
    );
    expect(comparisonParamsButton).not.toBeNull();
    if (!comparisonParamsButton) {
      return;
    }
    await comparisonParamsButton.click();
    await checkStatsticsPanel("#right-memory-usage-panel");
  });
});

describe("Compare - Compare button", () => {
  let browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await configurePage(page);
    await page.setViewport({ width: 1366, height: 768 });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/compare-within-layer");
  });

  afterAll(() => browser.close());

  it("Compare button should be present", async () => {
    await page.waitForSelector("#compare-button");
    expect(await page.$("#compare-button")).not.toBeNull();

    const compareButtonText = await page.$eval(
      "#compare-button > :first-child",
      (node) => (node as HTMLElement).innerText
    );
    const comapreButtonDisabled = await page.$eval(
      "#compare-button > button",
      (node) => node.disabled
    );
    const elemsArray = await page.$$("#compare-button > button");
    expect(comapreButtonDisabled).toBe(true);
    expect(elemsArray.length).toEqual(1);
    expect(compareButtonText).toEqual("Start comparing");
  });

  // All tiles loading is required to press button
  // So the test is be flaky due to internet dependency
  it.skip("Compare button should change mode", async () => {
    await page.waitForSelector("#compare-button");
    const sfLayer = await page.$(
      "#left-layers-panel > :nth-child(4) > :first-child > :first-child > :nth-child(2)"
    );
    expect(sfLayer).not.toBeNull();
    if (!sfLayer) {
      return;
    }
    await sfLayer.click();
    await page.waitForSelector("#compare-button > button:not([disabled])");
    const compareButton = await page.$(
      "#compare-button > button:not([disabled])"
    );
    expect(compareButton).not.toBeNull();

    if (!compareButton) {
      return;
    }

    await compareButton.click();

    const compareButtonText = await page.$eval(
      "#compare-button > :first-child",
      (node) => (node as HTMLElement).innerText
    );
    expect(compareButtonText).toEqual("Stop comparing");

    await compareButton.click();
    const elemsArray = await page.$$("#compare-button > button");
    expect(elemsArray.length).toEqual(2);
  });

  it("Should be disabled after mode change", async () => {
    const layerItems = await page.$$("#left-layers-panel input");
    const sf17Item = layerItems[1];
    await sf17Item.click();

    await page.waitForSelector("#compare-default-button");
    await page.click("#compare-default-button");
    await page.hover("a[href='/compare-across-layers']");
    await page.click("a[href='/compare-across-layers']");
    await page.waitForSelector("#right-layers-panel");

    await expect(page).toClick("#compare-button button", {
      text: "Start comparing",
    });
    const compareButtonText2 = await page.$eval(
      "#compare-button > :first-child > :last-child",
      (node) => (node as HTMLElement).innerText
    );
    expect(compareButtonText2).toBe("Start comparing");
  });
});
