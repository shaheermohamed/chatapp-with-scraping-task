const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();
const pool = require("../db");

router.post("/scrape", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res
      .status(400)
      .json({ success: false, error: "URL parameter is required" });
  }
  try {
    const headlines = await scrapeData(url);
    console.log("headlines:", headlines);
    await pool.query("INSERT INTO headlines (headline) VALUES ($1)", [
      headlines.join(";"),
    ]);

    res.json({
      success: true,
      message: "Data scraped and stored successfully",
      headlines: headlines,
    });
  } catch (error) {
    console.error("Error scraping and storing data:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/getheadlines", async (req, res) => {
  try {
    const scrapes = await pool.query("SELECT * FROM headlines");

    res.json({ success: true, scrapes: scrapes.rows });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

const scrapeData = async (url) => {
  try {
    const response = await axios.get(url);
    console.log("responseData:", response);
    const $ = cheerio.load(response.data);

    const headlines = [];
    $("title").each((index, element) => {
      headlines.push($(element).text());
    });

    return headlines;
  } catch (error) {
    console.error("Error scraping data:", error);
    throw error;
  }
};

module.exports = router;
