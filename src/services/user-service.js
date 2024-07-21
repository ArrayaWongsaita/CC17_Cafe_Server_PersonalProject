const { date } = require("joi");
const prisma = require("../models/prisma");

const userService = {};

userService.updateUserProfileByUserIdAndData = (id, data) =>
  prisma.user.update({
    where: {
      id: id,
    },
    data: data,
  });

userService.createUser = (data) => prisma.user.create({ data });

userService.findUserByEmail = (email) =>
  prisma.user.findFirst({ where: { email } });

userService.findUserByPhone = (phone) =>
  prisma.user.findFirst({ where: { phone } });

userService.findUserById = (userId) =>
  prisma.user.findUnique({ where: { id: userId } });

userService.findCartUserByUserId = (userId) =>
  prisma.cartItem.findMany({ where: { userId } });

userService.createCartItem = (data) => prisma.cartItem.create({ data });

userService.findCartItembyUserIdAndProductId = (userId, productId) =>
  prisma.cartItem.findFirst({
    where: {
      AND: {
        userId,
        productId,
      },
    },
  });

userService.editAmountInCartItemById = (id, amount) =>
  prisma.cartItem.update({
    where: {
      id,
    },
    data: {
      amount,
    },
  });

userService.removeCartByCardId = (id) =>
  prisma.cartItem.delete({
    where: { id },
  });
userService.findCartById = (id) => prisma.cartItem.findFirst({ where: { id } });

userService.findCartByUserId = (userId) =>
  prisma.cartItem.findMany({ where: { userId } });

userService.createOrder = (data) => prisma.order.create({ data });
userService.createManyOrderItem = (data) =>
  prisma.orderItem.createMany({
    data,
  });

userService.removeManyCartItemByUserId = (userId) =>
  prisma.cartItem.deleteMany({ where: { userId } });

userService.findOrderByUserId = (userId) =>
  prisma.order.findMany({ where: { userId } });

userService.findOrderItemByOrderId = (orderId) =>
  prisma.orderItem.findMany({ where: { orderId } });
userService.findOrderStatusPendingByUserId = (userId) =>
  prisma.order.findMany({
    where: {
      AND: {
        userId,
        status: "Pending",
      },
    },
  });

userService.getAllProduct = () => prisma.product.findMany({});
userService.getAllOrder = () => prisma.order.findMany({});

module.exports = userService;
