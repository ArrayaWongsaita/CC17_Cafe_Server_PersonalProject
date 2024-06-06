const { boolean } = require("joi");
const hashService = require("../services/hash-service");
const jwtService = require("../services/jwt-service");
const userService = require("../services/user-service");
const createError = require("../utils/create-error");

const authController = {};

authController.register = async (req, res, next) => {
  try {
    const data = req.input;
    const existUser = await userService.findUserByEmail(data?.email);
    if (existUser) {
      createError({
        message: "email already in use ",
        field: "email",
        statusCode: 400,
      });
    }
    const checkPhone = await userService.findUserByPhone(data?.phone);
    if (checkPhone) {
      createError({
        message: "phone already in use ",
        field: "phone",
        statusCode: 400,
      });
    }


    data.password = await hashService.hash(data.password);
    await userService.createUser(data);
    res.status(201).json({ message: "user created" });
  } catch (error) {
    next(error);
  }
};
authController.login = async (req, res, next) => {
  try {
    const existUser = await userService.findUserByEmail(req.input.email);

    if (!existUser) {
      createError({
        message: "Invalid Credentials",

        statusCode: 400,
      });
    }
    const isMatch = await hashService.compare(
      req.input.password,
      existUser.password
    );

    if (!isMatch) {
      createError({
        message: "Invalid Credentials",
        statusCode: 400,
      });
    }
    console.log(existUser)
    delete existUser.password
    const accessToken = jwtService.sign({ id: existUser.id });
    res.status(200).json({ ...existUser,accessToken });
  } catch (error) {
    next(error);
  }
};

module.exports = authController;
