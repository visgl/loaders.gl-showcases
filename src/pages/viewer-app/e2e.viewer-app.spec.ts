import puppeteer from 'puppeteer';

describe('ViewerApp', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 250,
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000/#/viewer');
  });

  afterAll(() => browser.close());

  it('Contains control panel', async () => {
    await page.waitForSelector('#control-panel');
    await page.select('#base-map', 'Light');
    const controlOptions = ['New York', 'San Francisco v1.6'];

    for await (const item of controlOptions) {
      expect(await page.select('#tileset', item)).toEqual([item]);
    }

    await page.click('#change-terrain');
  }, 10000);

  it('Contains building explorer', async () => {
    await page.select('#tileset', 'Building');
    await page.waitForSelector('#building-explorer');
    await page.click('#toggle-explorer');
    await page.click('#CheckBox220-icon');
  }, 10000);

  it('Contains statistic panel', async () => {
    await page.waitForSelector('#stats-panel');
  });
});
