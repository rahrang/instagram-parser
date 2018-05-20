const fs = require('fs');
const uniq = require('lodash/uniq');

// TODO: figure out a way to get all shortcodes from a page by scrolling

const { PROFILE_PAGE } = require('./constants');

const openFile = () => {
  let rawData = fs.readFileSync('shortCodes.json');
  return JSON.parse(rawData);
};

const closeFile = codes => {
  fs.writeFile('shortCodes.json', JSON.stringify(codes), err => {
    if (err) throw err;
    console.log('saved shortcodes');
    return true;
  });
};

module.exports = async page => {
  const codes = await openFile();

  await page.goto(`${PROFILE_PAGE}`);
  await page.waitFor(2000);
  const newCodes = await page.evaluate((getCode, validate) => {
    const elems = Array.from(document.querySelectorAll('._mck9w'));
    return elems.map(el => el.firstChild.pathname.split('/')[2]);
  });

  const allCodes = uniq([...codes, ...newCodes]);
  console.log('added', `${allCodes.length - codes.length}`, 'new shortcodes');
  res = await closeFile(allCodes);
  return res;
};
