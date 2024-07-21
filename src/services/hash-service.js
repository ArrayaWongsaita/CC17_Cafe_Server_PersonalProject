const becrypt = require("bcryptjs");

const hashService = {};

hashService.hash = (plainText) => becrypt.hash(plainText, 12);
hashService.compare = (plainText, hashValue) =>
  becrypt.compare(plainText, hashValue);

module.exports = hashService;
