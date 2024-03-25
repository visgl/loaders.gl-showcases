import "expect-puppeteer";
import { PageId } from "../../types";
import type { Page } from "puppeteer";

export const checkLayersPanel = async (
  page: Page,
  panelId: string,
  hasSelectedLayer = false,
  appMode = ""
): Promise<void> => {
  // Tabs
  const tabsContainer = await page.$(`${panelId} > :first-child`);
  expect((await tabsContainer?.$$(":scope > *"))?.length).toBe(2);
  expect(await tabsContainer?.$(":first-child::after")).toBeDefined();
  expect(await tabsContainer?.$(":last-child::after")).toBeNull();

  // Close button
  const closeButtonIcon = await page.$(
    `${panelId} > :nth-child(2) > :first-child > :first-child`
  );
  expect(await closeButtonIcon?.$(":scope::after")).toBeDefined();
  expect(await closeButtonIcon?.$(":scope::before")).toBeDefined();

  // Horizontal Line
  expect(
    await page.$eval(`${panelId} > :nth-child(3)`, (node) => node.innerHTML)
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

  const panel = await page.$(panelId);

  // Insert buttons
  await expect(panel).toMatchTextContent("Insert layer");
  await expect(panel).toMatchTextContent("Insert scene");

  // Open map options
  const mapOptionsTab = await tabsContainer?.$(":last-child");
  await mapOptionsTab?.click();
  expect(await tabsContainer?.$(":first-child::after")).toBeNull();
  expect(await tabsContainer?.$(":last-child::after")).toBeDefined();

  // Header
  await expect(panel).toMatchTextContent("Base Map");

  // Base maps list
  let names = [
    "Dark",
    "Light",
    "Light gray",
    "Dark gray",
    "Streets",
    "Streets(night)",
  ];
  if (appMode !== PageId.comparison) {
    names = [...names, "Terrain"];
  }
  let successCount = 0;
  for (const text of names) {
    const element = await page?.$(`text/${text}`);
    if (element) {
      successCount++;
    }
  }
  expect(successCount).toBe(names.length);

  // Dark is selected
  const elementDark = await page?.$("div ::-p-text(Dark)");

  let darkMapBackground;
  if (elementDark) {
    darkMapBackground = await page.evaluate((el) => {
      const parent = el.parentElement;
      if (parent) {
        const computedStyle = window.getComputedStyle(parent);
        return computedStyle.backgroundColor;
      } else {
        return null;
      }
    }, elementDark);
  }
  expect(darkMapBackground).toBe("rgb(57, 58, 69)"); //  "#393A45"

  // Insert Base Map button
  await page.waitForSelector("#map-options-container");
  const optionsContainer = await panel?.$("#map-options-container");
  await expect(optionsContainer).toMatchTextContent("Insert Base Map");
};

export const checkInserLayerErrors = async (
  page: Page,
  panelId: string,
  url: string
): Promise<void> => {
  await expect(page).toClick(
    `${panelId} div[data-testid='action-icon-button']`,
    {
      text: "Insert layer",
    }
  );

  const insertPanel = await page.$(`${panelId} > :nth-child(7)`);
  expect(insertPanel).not.toBeNull();

  await expect(insertPanel).toMatchTextContent("Insert Layer");

  // Submit on enter
  await expect(insertPanel).toFillForm("form.insert-form", {
    Name: "",
  });

  await page.keyboard.press("Enter");
  if (insertPanel) {
    await page.waitForSelector(`${panelId} form.insert-form span`);
    const nameWarning = await insertPanel.$eval(
      `${panelId} form.insert-form span`,
      (node) => node.innerText
    );
    expect(nameWarning).toBe("Please enter name");
  }

  // Fill wrong url
  await expect(insertPanel).toFillForm("form.insert-form", {
    Name: "asdf",
    URL: "asdf",
    Token: "asdf",
  });

  let submitInsert = await page.$(
    `${panelId} form.insert-form button[type='submit']`
  );
  expect(submitInsert).not.toBeNull();
  if (submitInsert) {
    await submitInsert.click();
  }

  if (insertPanel) {
    const warning = await insertPanel.$eval(
      `${panelId} form.insert-form span`,
      (node) => node.innerText
    );
    expect(warning).toBe("Invalid URL");
  }

  // Fill duplicated URL
  await expect(insertPanel).toFillForm("form.insert-form", {
    Name: "asdf",
    URL: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0",
    Token: "",
  });

  submitInsert = await page.$(
    `${panelId} form.insert-form button[type='submit']`
  );
  expect(submitInsert).not.toBeNull();
  if (submitInsert) {
    await submitInsert.click();
  }

  await page.waitForSelector(`${panelId} > :nth-child(7)`);
  const warningPanel = await page.$(`${panelId} > :nth-child(7)`);
  expect(warningPanel).not.toBeNull();
  if (warningPanel) {
    const warningText = await warningPanel.$eval(
      ":first-child > :first-child",
      (node) => (node as HTMLElement).innerText
    );
    expect(warningText).toBe(
      "You are trying to add an existing area to the map"
    );
  }

  await expect(page).toClick("button", { text: "Ok" });
  const anyExtraPanel = await page.$(`${panelId} > :nth-child(7)`);
  expect(anyExtraPanel).toBeNull();
};

export const insertAndDeleteLayer = async (
  page: Page,
  panelId: string,
  url: string
): Promise<void> => {
  await expect(page).toClick(
    `${panelId} div[data-testid='action-icon-button']`,
    {
      text: "Insert layer",
    }
  );

  const insertPanel = await page.$(`${panelId} > :nth-child(7)`);
  expect(insertPanel).not.toBeNull();

  // Add layer
  await expect(insertPanel).toFillForm("form.insert-form", {
    Name: "asdf",
    URL: url,
    Token: "",
  });

  await expect(insertPanel).toClick("button", {
    text: "Insert",
  });
  const anyExtraPanel = await page.$(`${panelId} > :nth-child(7)`);
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
  expect(newLayerSettings).not.toBeNull();
  if (newLayerSettings) {
    await newLayerSettings.click();
  }

  await page.waitForSelector("#react-tiny-popover-container");
  let removeButton = await page.$(
    "#react-tiny-popover-container > :first-child > :last-child"
  );
  expect(removeButton).not.toBeNull();
  if (removeButton) {
    await removeButton.click();
  }

  await page.waitForSelector(
    `${panelId} > :nth-child(4) > :first-child > :first-child > :nth-child(6)`
  );
  const deleteConfirmationText = await page.$eval(
    `${panelId} > :nth-child(4) > :first-child > :first-child > :nth-child(6)`,
    (node) => (node as HTMLElement).innerText
  );
  expect(deleteConfirmationText).toBe("Delete layer?\nNo, keep\nYes, delete");

  // Reject removal
  const keepButton = await page.$(
    `${panelId} > :nth-child(4) > :first-child > :first-child > :nth-child(6) > :last-child > :first-child`
  );
  expect(keepButton).not.toBeNull();
  if (keepButton) {
    await keepButton.click();
  }

  layers = await page.$$(
    `${panelId} > :nth-child(4) > :first-child > :first-child > div`
  );
  expect(layers.length).toBe(5);

  if (newLayerSettings) {
    await newLayerSettings.click();
  }

  await page.waitForSelector("#react-tiny-popover-container");
  removeButton = await page.$(
    "#react-tiny-popover-container > :first-child > :last-child"
  );

  if (removeButton) {
    await removeButton.click();
  }

  const confirmButton = await page.$(
    `${panelId} > :nth-child(4) > :first-child > :first-child > :nth-child(6) > :last-child > :last-child`
  );
  expect(confirmButton).not.toBeNull();
  if (confirmButton) {
    await confirmButton.click();
  }

  layers = await page.$$(
    `${panelId} > :nth-child(4) > :first-child > :first-child > div`
  );
  expect(layers.length).toBe(4);
};
