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

const checkLayersPanel = async (page, panelId: string) => {
  // Tabs
  const tabsContainer = await page.$(`${panelId} > :first-child`);
  expect((await tabsContainer.$$(":scope > *")).length).toBe(2);
  expect(await tabsContainer.$(":first-child::after")).toBeDefined();
  expect(await tabsContainer.$(":last-child::after")).toBeNull();

  // Close button
  const closeButtonIcon = await page.$(
    `${panelId} > :nth-child(2) > :first-child > :first-child`
  );
  expect(await closeButtonIcon.$(":scope::after")).toBeDefined();
  expect(await closeButtonIcon.$(":scope::before")).toBeDefined();

  // Horizontal Line
  expect(
    await page.$eval(`${panelId} > :nth-child(3)`, (node) => node.innerText)
  ).toBe("");

  // Layers
  const layers = await page.$$(
    `${panelId} > :nth-child(4) > :first-child > :first-child > div`
  );
  expect(layers.length).toBe(4);
  const selectedLayer = await page.$(
    `${panelId} > :nth-child(4) > :first-child > :first-child input:checked`
  );
  expect(selectedLayer).toBeNull();

  // Insert buttons
  const insertLayerText = await page.$eval(
    `${panelId} > :nth-child(4) > :first-child > :nth-child(2) > :first-child :last-child`,
    (node) => node.innerText
  );
  expect(insertLayerText).toBe("Insert layer");
  const insertSceneText = await page.$eval(
    `${panelId} > :nth-child(4) > :first-child > :nth-child(2) > :last-child  :last-child`,
    (node) => node.innerText
  );
  expect(insertSceneText).toBe("Insert scene");

  // Open map options
  const mapOptionsTab = await tabsContainer.$(":last-child");
  await mapOptionsTab.click();
  expect(await tabsContainer.$(":first-child::after")).toBeNull();
  expect(await tabsContainer.$(":last-child::after")).toBeDefined();

  // Header
  const baseMapTitle = await page.$eval(
    `${panelId} > :nth-child(4) > :first-child > :first-child`,
    (node) => node.innerText
  );
  expect(baseMapTitle).toBe("Base Map");

  // Base maps list
  const baseMapsNames = await page.$$eval(
    `${panelId} > :nth-child(4) > :first-child > :nth-child(2) > div`,
    (nodes) => nodes.map((node) => node.innerText)
  );
  expect(baseMapsNames.length).toBe(3);
  expect(baseMapsNames).toEqual(["Dark", "Light", "Terrain"]);

  // Dark is selected
  const darkMapBackground = await page.$eval(
    `${panelId} > :nth-child(4) > :first-child > :nth-child(2) > :first-child`,
    (node) => getComputedStyle(node).getPropertyValue("background-color")
  );
  expect(darkMapBackground).toBe("rgb(57, 58, 69)");

  // Insert Base Map button
  const insertButtonText = await page.$eval(
    `${panelId} > :nth-child(4) > :first-child > :nth-child(3)`,
    (node) => node.innerText
  );
  expect(insertButtonText).toBe("Insert Base Map");
};

const inserAndDeleteLayer = async (page, panelId: string, url: string) => {
  const insertButton = await page.$(
    `${panelId} > :nth-child(4) > :first-child > :nth-child(2) > :first-child`
  );
  await insertButton.click();
  await page.waitForSelector(`${panelId} > :nth-child(5)`);
  let insertPanel = await page.$(`${panelId} > :nth-child(5)`);

  // Header
  const insertPanelHeaderText = await insertPanel.$eval(
    `:first-child > :first-child`,
    (node) => node.innerText
  );
  expect(insertPanelHeaderText).toBe("Insert Layer");

  // Fill wrong url
  await expect(page).toFillForm(`${panelId} > :nth-child(5)`, {
    Name: "asdf",
    URL: "asdf",
    Token: "asdf",
  });
  await expect(page).toClick("button", { text: "Insert" });
  const warning = await insertPanel.$eval(`span`, (node) => node.innerText);
  expect(warning).toBe("Invalid URL");

  // Fill duplicated URL
  await expect(page).toFillForm(`${panelId} > :nth-child(5)`, {
    Name: "asdf",
    URL: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0",
  });
  await expect(page).toClick("button", { text: "Insert" });
  const warningPanel = await page.$(`${panelId} > :nth-child(5)`);
  const warningText = await warningPanel.$eval(
    `:first-child > :first-child`,
    (node) => node.innerText
  );
  expect(warningText).toBe("You are trying to add an existing area to the map");
  await expect(page).toClick("button", { text: "Ok" });
  let anyExtraPanel = await page.$(`${panelId} > :nth-child(5)`);
  expect(anyExtraPanel).toBeNull();

  await insertButton.click();
  insertPanel = await page.$(`${panelId} > :nth-child(5)`);

  // Add layer
  await expect(page).toFillForm(`${panelId} > :nth-child(5)`, {
    Name: "asdf",
    URL: url,
  });
  await expect(page).toClick("button", { text: "Insert" });
  anyExtraPanel = await page.$(`${panelId} > :nth-child(5)`);
  expect(anyExtraPanel).toBeNull();

  let layers = await page.$$(
    `${panelId} > :nth-child(4) > :first-child > :first-child > div`
  );
  expect(layers.length).toBe(5);
  const selectedLayer = await page.$(
    `${panelId} > :nth-child(4) > :first-child > :first-child input:checked`
  );
  expect(selectedLayer).not.toBeNull();
  const newLayerInputChecked = await page.$eval(
    `${panelId} > :nth-child(4) > :first-child > :first-child > :nth-child(5) input`,
    (node) => node.checked
  );
  expect(newLayerInputChecked).toBe(true);

  // Delete layer
  const newLayerSettings = await page.$(
    `${panelId} > :nth-child(4) > :first-child > :first-child > :nth-child(5) .settings`
  );
  await newLayerSettings.click();
  await page.waitForSelector(".react-tiny-popover-container");
  let removeButton = await page.$(
    ".react-tiny-popover-container > :first-child > :last-child"
  );
  await removeButton.click();
  await page.waitForSelector(
    `${panelId} > :nth-child(4) > :first-child > :first-child > :nth-child(6)`
  );
  const deleteConfirmationText = await page.$eval(
    `${panelId} > :nth-child(4) > :first-child > :first-child > :nth-child(6)`,
    (node) => node.innerText
  );
  expect(deleteConfirmationText).toBe("Delete layer?\nNo, keep\nYes, delete");

  // Reject removal
  const keepButton = await page.$(
    `${panelId} > :nth-child(4) > :first-child > :first-child > :nth-child(6) > :last-child > :first-child`
  );
  await keepButton.click();
  layers = await page.$$(
    `${panelId} > :nth-child(4) > :first-child > :first-child > div`
  );
  expect(layers.length).toBe(5);

  await newLayerSettings.click();
  await page.waitForSelector(".react-tiny-popover-container");
  removeButton = await page.$(
    ".react-tiny-popover-container > :first-child > :last-child"
  );
  await removeButton.click();
  const confirmButton = await page.$(
    `${panelId} > :nth-child(4) > :first-child > :first-child > :nth-child(6) > :last-child > :last-child`
  );
  await confirmButton.click();
  layers = await page.$$(
    `${panelId} > :nth-child(4) > :first-child > :first-child > div`
  );
  expect(layers.length).toBe(4);
};

describe("Layers Panel Across Layers mode", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/compare-across-layers");
  });

  afterAll(() => browser.close());

  it("Should show left layers panel", async () => {
    const panelId = "#left-layers-panel";
    await page.waitForSelector(panelId);
    expect(await page.$$(panelId)).toBeDefined();
    await checkLayersPanel(page, panelId);
  });

  it("Should show right layers panel", async () => {
    const panelId = "#right-layers-panel";
    await page.waitForSelector(panelId);
    expect(await page.$$(panelId)).toBeDefined();
    await checkLayersPanel(page, panelId);
  });

  it("Should select layers", async () => {
    // Select San Francisco v1.7 on left side
    const sfLayer = await page.$(
      `#left-layers-panel > :nth-child(4) > :first-child > :first-child > :nth-child(2)`
    );
    await sfLayer.click();
    const selectedLayer = await page.$(
      `#left-layers-panel > :nth-child(4) > :first-child > :first-child input:checked`
    );
    expect(selectedLayer).not.toBeNull();
    let selectedLayerRight = await page.$(
      `#right-layers-panel > :nth-child(4) > :first-child > :first-child input:checked`
    );
    expect(selectedLayerRight).toBeNull();
    const sfLayerInputChecked = await page.$eval(
      `#left-layers-panel > :nth-child(4) > :first-child > :first-child > :nth-child(2) input`,
      (node) => node.checked
    );
    expect(sfLayerInputChecked).toBe(true);

    // Select Building on right side
    const buldingLayer = await page.$(
      `#right-layers-panel > :nth-child(4) > :first-child > :first-child > :nth-child(4)`
    );
    await buldingLayer.click();
    selectedLayerRight = await page.$(
      `#right-layers-panel > :nth-child(4) > :first-child > :first-child input:checked`
    );
    expect(selectedLayerRight).not.toBeNull();
    const buldingLayerInputChecked = await page.$eval(
      `#right-layers-panel > :nth-child(4) > :first-child > :first-child > :nth-child(4) input`,
      (node) => node.checked
    );
    expect(sfLayerInputChecked).toBe(true);
    expect(buldingLayerInputChecked).toBe(true);
  });

  it("Should insert and delete layer", async () => {
    await inserAndDeleteLayer(
      page,
      "#left-layers-panel",
      "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/Rancho_Mesh_mesh_v17_1/SceneServer/layers/0"
    );

    await inserAndDeleteLayer(
      page,
      "#right-layers-panel",
      "https://fake.layer.url"
    );
  });
});

describe("Layers Panel Within Layer mode", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/compare-within-layer");
  });

  afterAll(() => browser.close());

  it("Should show left layers panel", async () => {
    const panelId = "#left-layers-panel";
    await page.waitForSelector(panelId);
    expect(await page.$$(panelId)).toBeDefined();
    await checkLayersPanel(page, panelId);
  });

  it("Shouldn't show right layers panel", async () => {
    const panelId = "#right-layers-panel";
    expect(await page.$(panelId)).toBeNull();
  });

  it("Should select layer", async () => {
    // Select New York on left side
    const sfLayer = await page.$(
      `#left-layers-panel > :nth-child(4) > :first-child > :first-child > :nth-child(3)`
    );
    await sfLayer.click();
    const selectedLayer = await page.$(
      `#left-layers-panel > :nth-child(4) > :first-child > :first-child input:checked`
    );
    expect(selectedLayer).not.toBeNull();
    const sfLayerInputChecked = await page.$eval(
      `#left-layers-panel > :nth-child(4) > :first-child > :first-child > :nth-child(3) input`,
      (node) => node.checked
    );
    expect(sfLayerInputChecked).toBe(true);
  });
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

describe("Map Control Panel", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
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
      `${panelId} > :first-child > svg`,
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

describe("Comparison Params Panel", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/compare-within-layer");
  });

  afterAll(() => browser.close());

  const checkComparisonParamsPanel = async (panelId: string) => {
    // Header
    const headerText = await page.$eval(
      `${panelId} > :first-child > :first-child`,
      (node) => node.innerText
    );
    expect(headerText).toBe("Comparison parameters");

    // Close button
    const closeButtonIcon = await page.$(
      `${panelId} > :first-child > :nth-child(2) > :first-child`
    );
    expect(await closeButtonIcon.$(":scope::after")).toBeDefined();
    expect(await closeButtonIcon.$(":scope::before")).toBeDefined();

    // Horizontal Line
    expect(
      await page.$eval(`${panelId} > :nth-child(2)`, (node) => node.innerText)
    ).toBe("");

    // Draco
    const dracoParamText = await page.$eval(
      `${panelId} > :nth-child(3) > :first-child`,
      (node) => node.innerText
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
      (node) => node.innerText
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
    await comparisonParamsButton.click();
    await checkComparisonParamsPanel("#left-comparison-params-panel");
  });

  it("Should show right comparison params panel", async () => {
    const mainToolsPanelId = "#right-tools-panel";
    const comparisonParamsButton = await page.$(
      `${mainToolsPanelId} > button:nth-child(1)`
    );
    await comparisonParamsButton.click();
    await checkComparisonParamsPanel("#right-comparison-params-panel");
  });
});

describe("Statistics", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/compare-within-layer");
  });

  afterAll(() => browser.close());

  const checkStatsticsPanel = async (panelId) => {
    // Header
    const headerText = await page.$eval(
      `${panelId} > :first-child > :first-child`,
      (node) => node.innerText
    );
    expect(headerText).toBe("Memory");

    // Close button
    const closeButtonIcon = await page.$(
      `${panelId} > :first-child > :nth-child(2) > :first-child`
    );
    expect(await closeButtonIcon.$(":scope::after")).toBeDefined();
    expect(await closeButtonIcon.$(":scope::before")).toBeDefined();

    // Horizontal Line
    expect(
      await page.$eval(`${panelId} > :nth-child(2)`, (node) => node.innerText)
    ).toBe("");
  };

  it("Should show left statistics panel", async () => {
    const mainToolsPanelId = "#left-tools-panel";
    const comparisonParamsButton = await page.$(
      `${mainToolsPanelId} > button:nth-child(3)`
    );
    await comparisonParamsButton.click();
    await checkStatsticsPanel("#left-memory-usage-panel");
  });

  it("Should show right statistics panel", async () => {
    const mainToolsPanelId = "#right-tools-panel";
    const comparisonParamsButton = await page.$(
      `${mainToolsPanelId} > button:nth-child(2)`
    );
    await comparisonParamsButton.click();
    await checkStatsticsPanel("#right-memory-usage-panel");
  });
});

describe("Compare button", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:3000/compare-within-layer");
  });

  afterAll(() => browser.close());

  it("Compare button should be present", async () => {
    await page.waitForSelector("#compare-button");
    expect(await page.$$("#compare-button")).toBeDefined();

    const compareButtonText = await page.$eval(
      "#compare-button > :first-child",
      (node) => node.innerText
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

  it("Compare button should change mode", async () => {
    await page.waitForSelector("#compare-button");
    const sfLayer = await page.$(
      `#left-layers-panel > :nth-child(4) > :first-child > :first-child > :nth-child(2)`
    );
    const comapreButton = await page.$("#compare-button > button");
    await sfLayer.click();
    await comapreButton.click();

    const compareButtonText = await page.$eval(
      "#compare-button > :first-child",
      (node) => node.innerText
    );
    expect(compareButtonText).toEqual("Stop comparing");

    await comapreButton.click();
    const elemsArray = await page.$$("#compare-button > button");
    expect(elemsArray.length).toEqual(2);
  });
});
