const express = require("express");
const { kamus, antonym, synonym } = require("../controllers");

const routes = express.Router();

// KAMUS
routes.get("/words", kamus.all);
routes.get("/word", kamus.search);
routes.get("/words/:bab", kamus.getByBab);

// ANTONYM
routes.get("/antonyms", antonym.all);
routes.get("/antonym", antonym.search);

// SYNONYM
routes.get("/synonyms", synonym.all);
routes.get("/synonym", synonym.search);

module.exports = routes;
