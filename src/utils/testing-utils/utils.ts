import type { Page } from "puppeteer";

const sleep = async (ms: number): Promise<void> => {
  await new Promise((resolve: (value: void | PromiseLike<void>) => void) =>
    setTimeout(resolve, ms)
  );
};

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
): Promise<string> => {
  await Promise.all([
    page.waitForNavigation({
      waitUntil: ["load", "domcontentloaded"],
    }),
    page.click(selector),
  ]);
  let currentUrl = page.url();
  if (waitFor) {
    for (let i = 0; i < URL_CHECKING_TIMEOUT / URL_CHECKING_INTERVAL; i++) {
      await sleep(URL_CHECKING_INTERVAL);
      currentUrl = page.url();
      if (currentUrl.includes(waitFor)) {
        break;
      }
    }
  }
  return currentUrl;
};
