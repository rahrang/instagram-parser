const puppeteer = require("puppeteer");
const _ = require("lodash");
const urlParse = require("url-parse");

const args = require("yargs").options({
  profile: {
    alias: "p",
    describe: "the profile for which you want post shortcodes",
    demandOption: true,
    type: "string"
  }
}).argv;

(async () => {
  const { profile } = args;
  const shortCodes = [];

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  page.setViewport({ height: 960, width: 1440 });
  await page.goto(`https://instagram.com/${profile}`);

  const igProfileData = await page.evaluate(() => _sharedData);
  const user = _.get(
    igProfileData,
    "entry_data.ProfilePage[0].graphql.user",
    undefined
  );
  if (_.isUndefined(user)) {
    console.log(
      `instagram profile with username "${profile}" could not be harvested. profile does not exist.`
    );
    await page.close();
    await browser.close();
    return [];
  }
  // const profileId = user.id

  const firstPost = _.get(
    user,
    "edge_owner_to_timeline_media.edges[0].node",
    undefined
  );
  if (_.isUndefined(firstPost)) {
    console.log(
      `instagram profile with username "${profile}" could not be harvested. no first post was found.`
    );
    await page.close();
    await browser.close();
    return [];
  }

  const firstPostSelector = `a[href='/p/${firstPost.shortcode}/']`;
  await page.waitForSelector(firstPostSelector);
  await page.click(firstPostSelector);

  while (true) {
    try {
      await page.waitForSelector("a.coreSpriteRightPaginationArrow");
      await page.click("a.coreSpriteRightPaginationArrow");

      const { pathname } = urlParse(page.url());
      const shortCode = _.trimEnd(_.trimStart(pathname, "/p/"), "/");
      shortCodes.push(shortCode);
    } catch (e) {
      console.log(e.message);
      break;
    }
  }

  console.log(shortCodes);

  await page.close();
  await browser.close();

  return shortCodes;
})();
