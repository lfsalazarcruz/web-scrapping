const request = require("request-promise");
const cheerio = require("cheerio");
const fakeUa = require("fake-useragent");
const fs = require("fs");

const moviesURL = [
  "https://www.imdb.com/title/tt0848228/?ref_=fn_al_tt_1",
  "https://www.imdb.com/title/tt4154796/?ref_=nv_sr_1?ref_=nv_sr_1"
];

(async () => {
  let moviesData = [];

  for (let movie of moviesURL) {
    const response = await request({
      uri: movie,
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

    let title = $('div[class="title_wrapper"] > h1')
      .text()
      .trim();
    let rating = $('span[itemprop="ratingValue"]').text();
    let poster = $('div[class="poster"] > a > img').attr("src");
    let totalRatings = $('span[itemprop="ratingCount"]').text();
    let releaseDate = $('a[title="See more release dates"]')
      .text()
      .trim();
    let genres = [];

    $('div[class="subtext"] > a[href^="/search"]').each((i, elm) => {
      let genre = $(elm).text();

      genres.push(genre);
    });

    moviesData.push({
      title,
      rating,
      poster,
      totalRatings,
      releaseDate,
      genres
    });
  }

  fs.writeFileSync("./data.json", JSON.stringify(moviesData), "utf-8");
  console.log(moviesData);
})();
