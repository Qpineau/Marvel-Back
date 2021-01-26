const express = require("express");
const router = express.Router();
const axios = require("axios");
const uid2 = require("uid2");
const md5 = require("md5");

const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;

router.get("/search-characters", async (req, res) => {
  try {
    const name = req.query.name;
    const limit = req.query.limit || 100;
    const offset = req.query.offset;
    const hash = md5(ts + privateKey + publicKey);
    const ts = uid2(12);

    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}&name=${name}`
    );

    res.json(response.data);
  } catch (error) {
    console.log("char search error", error.message);
    res.status(400).json({ message: error.message });
  }
});

router.get("/search-comics", async (req, res) => {
  try {
    const title = req.query.title;
    const limit = req.query.limit || 100;
    const offset = req.query.offset;
    const hash = md5(ts + privateKey + publicKey);
    const ts = uid2(12);

    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}&title=${title}`
    );

    res.json(response.data);
  } catch (error) {
    console.log("comics search error", error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
