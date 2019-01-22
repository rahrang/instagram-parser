const puppeteer = require('puppeteer');
const _ = require('lodash');
const urlParse = require('url-parse');

const args = require('yargs').options({
  profile: {
    alias: 'p',
    describe: 'the profile for which you want post shortcodes',
    demandOption: true,
    type: 'string'
  }
}).argv;

(async () => {
  const { profile } = args;
  const shortCodes = [];

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  page.setViewport({ height: 960, width: 1440 });
  const userPage = "https://instagram.com/" + profile;
  await page.goto(userPage);

  const igProfileData = await page.evaluate(() => _sharedData);
  const user = _.get(
    igProfileData,
    'entry_data.ProfilePage[0].graphql.user',
    undefined
  );
  if (_.isUndefined(user)) {
    await page.close();
    await browser.close();
    return [];
  }
  // const profileId = user.id

  const firstPost = _.get(
    user,
    'edge_owner_to_timeline_media.edges[0].node',
    undefined
  );
  if (_.isUndefined(firstPost)) {
    await page.close();
    await browser.close();
    return [];
  }

  const firstPostSelector = "a[href='/p/" + firstPost.shortcode + "/']"
  await page.waitForSelector(firstPostSelector);
  await page.click(firstPostSelector);

  while (true) {
    try {
      await page.waitForSelector('a.coreSpriteRightPaginationArrow');
      await page.click('a.coreSpriteRightPaginationArrow');

      const { pathname } = urlParse(page.url());
      const shortCode = _.trimEnd(_.trimStart(pathname, '/p/'), '/');
      shortCodes.push(shortCode);

    } catch (e) {
      break;
    }
  }
  
  await page.close();
  await browser.close();

  return shortCodes;
})();
