const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { getCache, setCache } = require("../utils/cache");

const router = express.Router();

router.get("/:id/official-updates", async (req, res) => {
  const MOCK_URL = "https://www.redcross.org/about-us/news-and-events.html";
  try {
    const response = await axios.get(MOCK_URL);
    const $ = cheerio.load(response.data);

    // Log sample titles found
    const headlines = [];
    $("a").each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 20) headlines.push(text);
    });

    console.log("Found headlines:", headlines.slice(0, 5));

    // Then use updated logic based on real structure
    const updates = [];
    $("a").each((_, el) => {
      const title = $(el).text().trim();
      const href = $(el).attr("href");
      if (title && href && title.length > 20) {
        updates.push({
          title,
          link: href.startsWith("http")
            ? href
            : `https://www.redcross.org${href}`,
        });
      }
    });

    res.json({ data: updates });
  } catch (err) {
    console.error("Scraping error:", err.message);
    res.status(500).json({ error: "Scraping failed" });
  }
});

module.exports = router;
