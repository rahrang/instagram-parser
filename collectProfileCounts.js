const { PROFILE_PAGE } = require('./constants');

const helpers = require('./helpers');

module.exports = async page => {
  await page.goto(`${PROFILE_PAGE}`);
  await page.waitFor(5000);

  const posts = await page.evaluate(() => {
    const el = document.querySelector(
      '#react-root > section > main > div > header > section > ul > li:nth-child(1) > span > span'
    );
    return isValid(el) ? parseInt(el.innerText) : 0;
  });

  const followers = await page.evaluate(() => {
    const el = document.querySelector(
      '#react-root > section > main > div > header > section > ul > li:nth-child(2) > span > span'
    );
    return isValid(el) ? parseInt(el.innerText) : 0;
  });

  const following = await page.evaluate(() => {
    const el = document.querySelector(
      '#react-root > section > main > div > header > section > ul > li:nth-child(3) > span > span'
    );
    return isValid(el) ? parseInt(el.innerText) : 0;
  });

  const res = { posts, followers, following };
  console.log(res);
  return res;
};
