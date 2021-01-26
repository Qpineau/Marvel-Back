const express = require("express");
const router = express.Router();
const axios = require("axios");
const uid2 = require("uid2");
const md5 = require("md5");
const cors = require("cors");

const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;
router.use(cors());

router.get("/characters", async (req, res) => {
  try {
    const offset = req.query.offset;
    const limit = req.query.limit || 100;
    const ts = req.query.ts;
    const hash = md5(ts + privateKey + publicKey);

    console.log(ts);
    console.log(hash);

    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`
    );
    res.json(response.data);
  } catch (error) {
    console.log("characters error", error.message);
    res.status(400).json({ message: error.message });
  }
});

router.get("/comics", async (req, res) => {
  try {
    const offset = req.query.offset;
    const limit = req.query.limit || 100;
    const ts = uid2(12);
    const hash = md5(ts + privateKey + publicKey);

    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`
    );
    res.json(response.data);
  } catch (error) {
    console.log("comics error", error.message);
    res.status(400).json({ message: error.message });
  }
});

router.get("/comics/:characterId", async (req, res) => {
  try {
    const characterId = req.params.characterId;
    const ts = uid2(12);
    const hash = md5(ts + privateKey + publicKey);

    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/characters/${characterId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
    );
    console.log(response.data.data);
    res.json(response.data);
  } catch (error) {
    console.log("characterId/comics", error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/favorites", async (req, res) => {
  const fav = req.fields.fav;
  const ts = uid2(12);
  const hash = md5(ts + privateKey + publicKey);

  let favTab = [[], []];
  try {
    for (let i = 0; i < fav.length; i++) {
      if (i === 0) {
        for (let j = 0; j < fav[i].length; j++) {
          const response = await axios.get(
            `http://gateway.marvel.com/v1/public/characters/${fav[i][j]}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
          );

          favTab[0].push(response.data.data);
        }
      } else {
        for (let j = 0; j < fav[i].length; j++) {
          const response = await axios.get(
            `http://gateway.marvel.com/v1/public/comics/${fav[i][j]}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
          );

          favTab[1].push(response.data.data);
        }
      }
    }
    res.json(favTab);
  } catch (error) {
    console.log("error in favorites", error.response.data);
    console.log("favorites", error.message);
  }
});

module.exports = router;
