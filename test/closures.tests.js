const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const config = require('./config');

describe('test evaluating JS script in Puppeteer', async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null});
  const page = await browser.newPage();
  const name = 'world';
  await page.evaluate((p_name) => alert('Hello ' + p_name), [name]);
  browser.close();
});
