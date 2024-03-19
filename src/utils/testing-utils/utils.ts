import type { Page } from "puppeteer";

const URL_CHECKING_INTERVAL = 500;
const URL_CHECKING_TIMEOUT = 10000;
/**
 * Clicks on an element and waits until indirect navigations complete.
 * In case of multiple navigations performed by the application with unpredictable timings
 * you might want to wait for the current URL to match some string before returning.
 * @param page - Page instance.
 * @param selector - Selector of the element to click on.
 * @param waitFor - substring that is expected to be a part of the URL.
 * @returns current URL.
 */
export const clickAndNavigate = async (
  page: Page,
  selector: string,
  waitFor?: string
) => {
  await Promise.all([
    page.waitForNavigation({
      waitUntil: ["load", "domcontentloaded", "networkidle0"],
    }),
    page.click(selector),
  ]);
  let currentUrl = page.url();
  if (waitFor) {
    for (let i = 0; i < URL_CHECKING_TIMEOUT / URL_CHECKING_INTERVAL; i++) {
      await page.waitForTimeout(URL_CHECKING_INTERVAL);
      currentUrl = page.url();
      if (currentUrl.includes(waitFor)) {
        break;
      }
    }
  }
  return currentUrl;
};
