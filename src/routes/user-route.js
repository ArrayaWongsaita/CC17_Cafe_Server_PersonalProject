const express = require("express");
const authenticate = require("../middlewares/authenticatel");
const userController = require("../controllers/user-controller");
const upload = require("../middlewares/upload");

const userRouter = express.Router();

userRouter.patch("/edit/profile", authenticate, userController.editUserProfile);
userRouter.get("/", authenticate, userController.getCart);
userRouter.post("/", authenticate, userController.createCart);
userRouter.patch("/", authenticate, userController.editCart);
userRouter.delete("/:cartId", authenticate, userController.removeCart);
userRouter.post(
  "/order",
  authenticate,
  upload.single("slipImage"),
  userController.postOrder
);
userRouter.get("/order", authenticate, userController.getAllOrder);
userRouter.get(
  "/order/detail/:orderId",
  authenticate,
  userController.getOrderDetail
);
userRouter.get("/order/pending", authenticate, userController.getPendingOrder);
userRouter.get("/order/me", authenticate, userController.getAllOrderUser);

module.exports = userRouter;
