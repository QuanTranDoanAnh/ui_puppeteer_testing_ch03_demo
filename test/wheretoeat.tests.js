const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless : false, defaultViewport: null});
    const page = await browser.newPage();
    const context = browser.defaultBrowserContext();
    await context.overridePermissions('https://www.google.com', ['geolocation']);
    await page.setGeolocation({latitude: 48.8578349, longitude: 2.3249841});
    await page.goto('https://www.google.com');
    await page.type('[name="q"]', 'where to eat');
    await page.keyboard.press('Enter');

    const [response] = await Promise.all([
        page.waitForNavigation,
        page.waitForSelector('#search'),
    ]);
    
    await page.emulateMediaType('print');
    await page.screenshot({ path: 'wheretoeat.png' });
    await browser.close();
})();