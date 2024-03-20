import puppeteer, { type Browser, type Page } from "puppeteer";
import {
  checkInserLayerErrors,
  checkLayersPanel,
  inserAndDeleteLayer,
} from "../../utils/testing-utils/e2e-layers-panel";

describe("Debug", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.setDefaultTimeout(10000);
    await page.setViewport({ width: 1366, height: 768 });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/debug");
  });

  afterAll(async () => {
    await browser.close();
  });

  it("Should automatically redirect from to the initial layer", async () => {
    const currentUrl = page.url();
    expect(currentUrl).toContain(
      "http://localhost:3000/debug?tileset=san-francisco-v1_7"
    );
  });

  it("Should activate 'Debug' menu item", async () => {
    expect(
      await page.$eval(
        "#header-links-default>a[active='1']",
        (node) => node.textContent
      )
    ).toEqual("Debug");
  });
});

describe("Debug - Main tools panel", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.setDefaultTimeout(10000);
    await page.goto("http://localhost:3000/debug");
    await page.click("#map-control-panel>div:first-child");
  });

  afterAll(async () => {
    await browser.close();
  });

  it("Should show Main tools panel", async () => {
    expect(await page.$$("#debug-tools-panel")).toBeDefined();
    const panel = await page.$("#debug-tools-panel");
    const panelChildren = await panel?.$$(":scope > *");
    expect(panelChildren?.length).toEqual(5);
  });

  it("Should open layers panel", async () => {
    expect(await page.$("#debug--layers-panel")).toBeNull();
    const layersPanelButton = await page.$(
      "#debug-tools-panel>button:first-child"
    );
    await layersPanelButton?.click();
    expect(await page.$("#debug--layers-panel")).toBeDefined();

    await layersPanelButton?.click();
    expect(await page.$("#debug--layers-panel")).toBeNull();
  });

  it("Memory Usage tab works", async () => {
    await page.click("#memory-usage-tab");
    await page.waitForSelector("#debug-memory-usage-panel", {
      visible: true,
    });
  }, 30000);

  it("Validator tab works", async () => {
    await page.click("#validator-tab");
    await page.waitForSelector("#semantic-validator", {
      visible: true,
    });
  }, 60000);

  it("Debug tab works", async () => {
    await page.click("#debug-panel-tab");
    await page.waitForSelector("#debug-panel-title", {
      visible: true,
    });
  }, 30000);

  it("Bookmarks tab works", async () => {
    await page.click("#bookmarks-tab");
    await page.waitForSelector("#debug-bookmarks-panel", {
      visible: true,
    });
  }, 60000);
});

describe("Debug - Layers panel", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.setDefaultTimeout(10000);
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/debug");
    const layersPanelButton = await page.$(
      "#debug-tools-panel>button:first-child"
    );
    await layersPanelButton?.click();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("Should close layers panel", async () => {
    const closeButton = await page.$("#layers-panel-close-button");
    await closeButton?.click();
    expect(await page.$("#debug--layers-panel")).toBeNull();
  });

  it("Should show layers panel", async () => {
    const panelId = "#debug--layers-panel";
    await page.waitForSelector(panelId);
    expect(await page.$$(panelId)).toBeDefined();
    await checkLayersPanel(page, panelId, true);
  }, 60000);

  it("Should select initial layer", async () => {
    expect(
      await page.$eval(
        "#debug--layers-panel #san-francisco-v1_7>input",
        (node) => node.checked
      )
    ).toBeTruthy();
  });

  it("Should validate inser layer form", async () => {
    await checkInserLayerErrors(
      page,
      "#debug--layers-panel",
      "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/Rancho_Mesh_mesh_v17_1/SceneServer/layers/0"
    );
  }, 60000);

  it("Should insert and delete layers", async () => {
    await inserAndDeleteLayer(
      page,
      "#debug--layers-panel",
      "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/Rancho_Mesh_mesh_v17_1/SceneServer/layers/0"
    );
  }, 60000);
});

describe("Debug - Debug panel", () => {
  let browser: Browser;
  let page: Page;

  const checkAndClickToggle = async ({
    toggleId,
    titleId,
    titleText,
  }: {
    toggleId: string;
    titleId: string;
    titleText: string;
  }): Promise<void> => {
    const toggle = await page.$(`#${toggleId}~span`);
    expect(toggle).toBeDefined();

    await page.waitForSelector(`#${titleId}`);
    await expect(page).toMatchTextContent(titleText);

    await expect(page).toClick(`#${toggleId}~span`);
  };

  const scrollAndClick = async (selector: string): Promise<void> => {
    await page.waitForSelector(selector);
    await expect(page).toClick(selector);
  };

  const toggles = {
    differentViewports: {
      toggleId: "toggle-minimap-viewport",
      titleId: "toggle-different-viewports-title",
      titleText: "Use different Viewports",
    },
    minimap: {
      toggleId: "toggle-minimap",
      titleId: "toggle-minimap-title",
      titleText: "Minimap",
    },
    loadingTiles: {
      toggleId: "toggle-loading-tiles",
      titleId: "toggle-loading-tiles-title",
      titleText: "Loading Tiles",
    },
    picking: {
      toggleId: "toggle-enable-picking",
      titleId: "toggle-picking-title",
      titleText: "Enable picking",
    },
    wireframe: {
      toggleId: "toggle-enable-wireframe",
      titleId: "toggle-wireframe-title",
      titleText: "Wireframe mode",
    },
    textureUvs: {
      toggleId: "toggle-enable-texture-uvs",
      titleId: "toggle-texture-uv-title",
      titleText: "Texture UVs",
    },
    boundingVolumes: {
      toggleId: "toggle-enable-bounding-volumes",
      titleId: "bounding-volumes-section-title",
      titleText: "Bounding Volumes",
    },
  };

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.setDefaultTimeout(10000);
    await page.setViewport({ width: 1366, height: 768 });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/debug");
    // Open debug panel
    await page.click("#debug-panel-tab");
  });

  afterAll(async () => {
    await browser.close();
  });

  it("Check header", async () => {
    // Check panel title
    await page.waitForSelector("#debug-panel-title");
    const mainTitle = await page.$eval(
      "#debug-panel-title",
      (e) => e.textContent
    );
    expect(mainTitle).toBe("Debug Panel");

    // Check close button
    const closeButton = await page.$("debug-panel-close-button");
    expect(closeButton).toBeDefined();
  });

  it("Check toggles", async () => {
    // Check that different vieports toggle is presented and working
    await checkAndClickToggle(toggles.differentViewports);

    // Turn off minimap
    await checkAndClickToggle(toggles.minimap);

    // Check if different vieports toggle hides when user turns off the minimap.
    expect(await page.$("toggle-different-viewports-title")).toBeNull();
    expect(await page.$("toggle-minimap-viewport")).toBeNull();

    // Check and click on other toggles
    await checkAndClickToggle(toggles.loadingTiles);
    await checkAndClickToggle(toggles.picking);
    await checkAndClickToggle(toggles.wireframe);
    await checkAndClickToggle(toggles.textureUvs);
  }, 40000);

  it("Check tile colors", async () => {
    // Check title in Color section
    const colorSectionTitle = await page.$("#color-section-title");
    await expect(colorSectionTitle).toMatchTextContent("Color");

    // Check color radio buttons are clickable
    await page.hover("#color-section-radio-button-random");
    await expect(page).toClick("#color-section-radio-button-random");
    await page.hover("#color-section-radio-button-original");
    await expect(page).toClick("#color-section-radio-button-original");
    await page.hover("#color-section-radio-button-depth");
    await expect(page).toClick("#color-section-radio-button-depth");
    await page.hover("#color-section-radio-button-custom");
    await expect(page).toClick("#color-section-radio-button-custom");
  }, 30000);

  it("Check bounding volumes", async () => {
    const panel = await page.$("#debug--toggle-options-container");
    expect(panel).not.toBeNull();
    // Check if bounding volumes types settings are hidden
    await expect(panel).not.toMatchElement("#bounding-volume-type-title");
    await expect(panel).not.toMatchElement("#bounding-volume-type-button-mbs");
    await expect(panel).not.toMatchElement("#bounding-volume-type-button-obb");

    // Check if bounding volumes colors settings are hidden
    await expect(panel).not.toMatchElement("#bounding-volume-color-title");
    await expect(panel).not.toMatchElement(
      "#bounding-volume-color-button-original"
    );
    await expect(panel).not.toMatchElement(
      "#bounding-volume-color-button-tile"
    );

    // Enable bounding columes toggle
    await checkAndClickToggle(toggles.boundingVolumes);

    // Check if bounding volume types are available
    await expect(panel).toMatchElement("#bounding-volume-type-title");
    await expect(panel).toMatchElement("#bounding-volume-type-button-mbs");
    await expect(panel).toMatchElement("#bounding-volume-type-button-obb");

    // Check radio buttons are clickable
    await scrollAndClick("#bounding-volume-type-button-obb");
    await scrollAndClick("#bounding-volume-type-button-mbs");

    // Check if bounding volumes colors settings are available
    await expect(panel).toMatchElement("#bounding-volume-color-title");
    await expect(panel).toMatchElement(
      "#bounding-volume-color-button-original"
    );
    await expect(panel).toMatchElement("#bounding-volume-color-button-tile");

    // Check radio buttons are clickable
    await expect(panel).toClick("#bounding-volume-color-button-tile");
    await expect(panel).toClick("#bounding-volume-color-button-original");
  }, 30000);
});

const chevronSvgHtml =
  '<path d="M.58 6c0-.215.083-.43.247-.594l5.16-5.16a.84.84 0 1 1 1.188 1.189L2.609 6l4.566 4.566a.84.84 0 0 1-1.189 1.188l-5.16-5.16A.838.838 0 0 1 .581 6Z"></path>';
const plusSvgHtml = '<path d="M14 8H8v6H6V8H0V6h6V0h2v6h6v2Z"></path>';
const minusSvgHtml = '<path d="M14 2H0V0h14v2Z"></path>';
const panSvgHtml =
  '<path d="M10 .5 6 5h8L10 .5ZM5 6 .5 10 5 14V6Zm10 0v8l4.5-4L15 6Zm-5 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-4 7 4 4.5 4-4.5H6Z"></path>';
const orbitSvgHtml =
  '<path d="M0 9a9 9 0 0 0 9 9c2.39 0 4.68-.94 6.4-2.6l-1.5-1.5A6.706 6.706 0 0 1 9 16C2.76 16-.36 8.46 4.05 4.05 8.46-.36 16 2.77 16 9h-3l4 4h.1L21 9h-3A9 9 0 0 0 0 9Z"></path>';
const compasSvgHtml =
  '<path d="M0 12 6 0l6 12H0Z" fill="#F95050"></path><path d="M12 12 6 24 0 12h12Z"></path>';

describe("Debug - Map Control Panel", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    page.setDefaultTimeout(10000);
    await page.setViewport({ width: 1366, height: 768 });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/debug");
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
