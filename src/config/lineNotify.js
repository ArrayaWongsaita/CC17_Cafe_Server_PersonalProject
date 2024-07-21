const axios = require("axios");
const createError = require("../utils/create-error");

module.exports = LineNotify = async (formData) => {
  try {
    const response = await axios.post(
      "https://notify-api.line.me/api/notify",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.LINE_TOKEN}`,
          ...formData.getHeaders(),
        },
      }
    );
    return response.data;
  } catch (error) {
    createError({
      message: `${error}`,
    });
  }
};
