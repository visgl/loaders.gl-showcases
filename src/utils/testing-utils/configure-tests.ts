import type { HTTPRequest, Page } from "puppeteer";

/**
 * Configure page before running test on it:
 * - abort all requests to map services and image/style/font resources
 * @param page puppeteer Page instance
 */
export const configurePage = async (page: Page): Promise<void> => {
  await page.setRequestInterception(true);
  page.on("request", (request: HTTPRequest) => {
    if (
      ["image", "stylesheet", "font"].includes(request.resourceType()) ||
      request.url().includes("https://tiles.arcgis.com") ||
      request.url().includes(".mvt")
    ) {
      void request.abort();
    } else {
      void request.continue();
    }
  });
};
