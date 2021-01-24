const express = require("express");
const router = express.Router();
const axios = require("axios");
const uid2 = require("uid2");
const md5 = require("md5");

const ts = uid2(12);
const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;
const hash = md5(ts + privateKey + publicKey);

router.get("/search-characters", async (req, res) => {
  try {
    const name = req.query.name;
    const limit = req.query.limit || 100;
    const skip = req.query.skip;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?ts=${ts}&apiKey=${publicKey}&hash=${hash}&limit=${limit}&skip=${skip}&name=${name}`
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
    const skip = req.query.skip;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?ts=${ts}&apiKey=${publicKey}&hash=${hash}&limit=${limit}&skip=${skip}&title=${title}`
    );

    res.json(response.data);
  } catch (error) {
    console.log("comics search error", error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
