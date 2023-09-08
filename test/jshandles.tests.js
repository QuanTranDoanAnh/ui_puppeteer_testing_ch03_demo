const puppeteer = require('puppeteer');
const expect = require('chai').expect;

describe('verify JS Handle', async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null});
  const page = await browser.newPage();

  const counter = await page.evaluateHandle(() => {
    window.counter = { count: 2 };
    return window.counter;
  });

  await counter.evaluate((c, inc) => c.count += inc, 3);
  await page.evaluate(() => alert(window.counter.count));
  browser.close();
});