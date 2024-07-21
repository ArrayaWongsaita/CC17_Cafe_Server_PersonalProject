const cloudinary = require("../config/cloudinary");

const removeService = {};

removeService.remove = async (path) => {
  const result = await cloudinary.uploader.destroy(path);
  return result;
};

module.exports = removeService;
