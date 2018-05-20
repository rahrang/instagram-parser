const puppeteer = require('puppeteer');
const dateFns = require('date-fns');

const collectProfileCounts = require('./collectProfileCounts');
const collectShortCodes = require('./collectShortCodes');

const { isValid, getShortCodeFromElement } = require('./helpers');

const today = dateFns.format(new Date(), 'YYYY-MM-DD');

const scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 800 });
  await page.exposeFunction('isValid', isValid);
  await page.exposeFunction('getShortCodeFromElement', getShortCodeFromElement);

  const profileCounts = await collectProfileCounts(page);
  const addedShortCodes = await collectShortCodes(page);

  browser.close();
  return;
};

scrape();
