const antonimController = require("./antonimController");
const kamusControllers = require("./kamusControllers");
const synonymController = require("./synonymController");

module.exports = {
  antonym: antonimController,
  kamus: kamusControllers,
  synonym: synonymController,
};
