import { PageId } from "../../types";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const checkLayersPanel = async (
  page,
  panelId: string,
  hasSelectedLayer = false,
  appMode = ""
) => {
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
  if (hasSelectedLayer) {
    expect(selectedLayer).toBeDefined();
  } else {
    expect(selectedLayer).toBeNull();
  }

  // Insert buttons
  const insertLayerText = await page.$eval(
    `${panelId} > :nth-child(4) > :first-child > :nth-child(2) > :first-child > :last-child`,
    (node) => node.innerText
  );
  expect(insertLayerText).toBe("Insert layer");
  const insertSceneText = await page.$eval(
    `${panelId} > :nth-child(4) > :first-child > :nth-child(2) > :nth-child(2) > :last-child`,
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

  if (appMode === PageId.comparison) {
    expect(baseMapsNames.length).toBe(2);
    expect(baseMapsNames).toEqual(["Dark", "Light"]);
  } else {
    expect(baseMapsNames.length).toBe(3);
    expect(baseMapsNames).toEqual(["Dark", "Light", "Terrain"]);
  }

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

const clearInput = async (page, selector) => {
  const input = await page.$(selector);
  await input.click({ clickCount: 3 });
  await page.keyboard.press("Backspace");
};

const fillTextInput = async (page, selector, value) => {
  await clearInput(page, selector);
  await page.type(selector, value);
};

const fillForm = async (page, selector, values) => {
  for (const inputName in values) {
    const value = values[inputName];
    await fillTextInput(page, `${selector} input[name=${inputName}]`, value);
  }
};

export const inserAndDeleteLayer = async (
  page,
  panelId: string,
  url: string
) => {
  const insertButton = await page.$(
    `${panelId} > :nth-child(4) > :first-child > :nth-child(2) > :first-child`
  );
  await insertButton.click();
  let insertPanel = await page.$(`${panelId} > :nth-child(7)`);

  // Header
  const insertPanelHeaderText = await insertPanel.$eval(
    `:first-child > :first-child`,
    (node) => node.innerText
  );
  expect(insertPanelHeaderText).toBe("Insert Layer");

  // Submit on enter
  await fillForm(page, `${panelId} form.insert-form`, {
    Name: "",
  });
  await page.keyboard.press("Enter");
  await sleep(200);
  const nameWarning = await insertPanel.$eval(
    `${panelId} form.insert-form span`,
    (node) => node.innerText
  );
  expect(nameWarning).toBe("Please enter name");

  // Fill wrong url
  await fillForm(page, `${panelId} form.insert-form`, {
    Name: "asdf",
    URL: "asdf",
    Token: "asdf",
  });
  let submitInsert = await page.$(
    `${panelId} form.insert-form button[type='submit']`
  );
  await submitInsert.click();
  const warning = await insertPanel.$eval(
    `${panelId} form.insert-form span`,
    (node) => node.innerText
  );
  expect(warning).toBe("Invalid URL");

  // Fill duplicated URL
  await fillForm(page, `${panelId} form.insert-form`, {
    Name: "asdf",
    URL: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0",
    Token: "",
  });
  submitInsert = await page.$(
    `${panelId} form.insert-form button[type='submit']`
  );
  await submitInsert.click();
  await page.waitForSelector(`${panelId} > :nth-child(7)`);
  const warningPanel = await page.$(`${panelId} > :nth-child(7)`);
  const warningText = await warningPanel.$eval(
    `:first-child > :first-child`,
    (node) => node.innerText
  );
  expect(warningText).toBe("You are trying to add an existing area to the map");
  await expect(page).toClick("button", { text: "Ok" });
  let anyExtraPanel = await page.$(`${panelId} > :nth-child(7)`);
  expect(anyExtraPanel).toBeNull();

  await insertButton.click();
  insertPanel = await page.$(`${panelId} > :nth-child(7)`);

  // Add layer
  await fillForm(page, `${panelId} form.insert-form`, {
    Name: "asdf",
    URL: url,
    Token: "",
  });
  submitInsert = await page.$(
    `${panelId} form.insert-form button[type='submit']`
  );
  await submitInsert.click();
  anyExtraPanel = await page.$(`${panelId} > :nth-child(7)`);
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
