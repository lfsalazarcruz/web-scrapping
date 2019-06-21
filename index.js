const request = require("request-promise");
const cheerio = require("cheerio");
const fakeUa = require("fake-useragent");

const URL = "https://www.imdb.com/title/tt0848228/?ref_=fn_al_tt_1";

(async () => {
  const response = await request({
    uri: URL,
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      dnt: "1",
      "upgrade-insecure-requests": "1",
      "user-agent": fakeUa()
    },
    gzip: true
  });

  let $ = cheerio.load(response);

  let title = $('div[class="title_wrapper"] > h1').text();
  let rating = $('span[itemprop="ratingValue"]').text();

  console.log(title, rating);
})();
