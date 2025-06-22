import puppeteer from 'puppeteer';

// Simple smoke test to ensure Puppeteer can launch

describe('Puppeteer setup', () => {
  it('launches a headless browser', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const title = await page.title();
    expect(title).toBe('Example Domain');
    await browser.close();
  }, 15000);
});
