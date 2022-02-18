import puppeteer from 'puppeteer';

describe('Dashboard', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  afterAll(() => browser.close());

  it('Contains header', async () => {
    await page.waitForSelector('#header-logo');
    const text = await page.$eval('#header-logo', e => e.textContent);
    expect(text).toContain('I3S Explorer');
  });

  it('Contains page links', async () => {
    await page.waitForSelector('#header-links');

    const linksParent = await page.$('#header-links');

    expect(
      await linksParent.$$eval('a', nodes => nodes.map(n => n.innerText))
    ).toEqual(['Home', 'Viewer', 'Debug', 'Comparison', 'About Us']);
  });

  it('Contains dashboard canvas', async () => {
    await page.waitForSelector('#dashboard-app');

    const dashboardCanvas = await page.$$('#dashboard-app');
    expect(dashboardCanvas).toBeDefined();
  });
});
