const authController = require("../controllers/auth-controller");
const authenticate = require("../middlewares/authenticatel");
const {
  registerValidator,
  loginValidator,
} = require("../middlewares/validator");

const express = require("express");
const authRouter = express.Router();

authRouter.post("/register", registerValidator, authController.register);
authRouter.post("/login", loginValidator, authController.login);
authRouter.get("/me", authenticate, authController.getMe);

module.exports = authRouter;
