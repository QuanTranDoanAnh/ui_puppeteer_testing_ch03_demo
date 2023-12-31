const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const should = require('chai').should();
const HomePageModel = require('./pom/HomePageModel.js');
const config = require('./config');
const fs = require('fs');
var exec = require('child_process').exec;
const Path = require('path');
const Differencify = require('differencify');
const differencify = new Differencify({ debug: true, mismatchThreshold: 0});

describe('Home Page', () => {
    let browser;
    let page;
    let pageModel;
    
    before(async() => {
        browser = await puppeteer.launch(config.launchOptions);
    });

    beforeEach(async () => {
        page = await browser.newPage();
        page.setDefaultTimeout(config.timeout);
        pageModel = new HomePageModel(page, config);
        await pageModel.go();
    })

    afterEach(async () => {
        await page.close();
    })

    after(async () => {
        await browser.close();
    })

    it('Should have right price and stock', async() => {
      (await pageModel.getPrice(config.productToTestName)).should.equal('$1199');
      (await pageModel.getStock(config.productToTestName)).should.equal('15 left in stock');
    });

    it('Should switch views', async() => {
      await pageModel.switchToView('list');
      expect(await page.$$('.list-group-item')).not.to.be.empty;
      await pageModel.switchToView('grid');
      expect(await page.$$('.list-group-item')).to.be.empty;
    });

    it('Should load all images', async() => {
      const images = (await page.evaluateHandle(() => 
        Array.from(document.querySelectorAll('IMG')).filter(e => !e.naturalWidth)));
       (await images.evaluate(e => e.length)).should.equal(0);
    });

    it('Should visually match', async() => {
      for (const device of ['iPhone 6', 'iPad', 'iPad landscape', '']) {
      
        const target = differencify.init({ chain: false, testName: 'Home ' + device});
        await target.launch();
        const page = await target.newPage();

        if (device) {
          await page.emulate(puppeteer.devices[device]);
        } else {
          await page.setViewport({width: 1600, height: 1200});
        }
        
        await page.goto(config.baseURL);
        const image = await target.screenshot();
        const result = await target.toMatchSnapshot(image);
        await page.close();
        await target.close();

        expect(result).to.be.true;
      }
    });

    const deleteFolderRecursive = function(path) {
      try {
        if (fs.existsSync(path)) {
          fs.readdirSync(path).forEach((file, index) => {
            const curPath = Path.join(path, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
            } else { // delete file
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(path);
        }
      }
      catch {
        console.log('Unabled to delete folder');
      }
    };
});