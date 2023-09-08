const puppeteer = require('puppeteer');

describe('Takes screenshot of the Packtpub home page', async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null});
  const page = await browser.newPage();
  await page.goto('https://www.packtpub.com/', { waitUntil: 'networkidle2'});

  await page.screenshot({ path: 'normal-only-viewport.png'});
  await page.screenshot({ path: 'full-page.png', fullPage: true });
  await page.screenshot({
    path: 'clip.png',
    clip: {
      x: 300,
      y: 150,
      width: 286,
      height: 64
    }
  });
  await page.waitForSelector('.expert-reading-section .slick-slide:nth-child(1) .product-card');
  const firstBook = await page.$('.expert-reading-section .slick-slide:nth-child(1) .product-card');
  await firstBook.screenshot({ path: 'first-book.png'});
  browser.close();
});
