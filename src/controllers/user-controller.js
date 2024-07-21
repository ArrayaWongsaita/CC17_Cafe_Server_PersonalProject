const uploadService = require("../services/upload-service");
const userService = require("../services/user-service");
const createError = require("../utils/create-error");
const fs = require("fs/promises");
const sentLineMassage = require("../services/lineNotify-service");
const hashService = require("../services/hash-service");

const userController = {};

userController.editUserProfile = async (req, res, next) => {
  try {
    const data = req.body;

    const checkPhone = await userService.findUserByPhone(data?.phone);
    console.log(req.body);

    console.log(req.user);
    if (data?.phone !== req.user.phone) {
      if (checkPhone) {
        createError({
          message: "phone already in use ",
          field: "phone",
          statusCode: 400,
        });
      }
    }

    console.log("data", data);
    console.log("edit");
    if (data.isChangePassword === true) {
      data.password = await hashService.hash(data.password);
      delete data.confirmPassword;
    } else {
      delete data.password;
      delete data.confirmPassword;
    }
    delete data.isChangePassword;
    const result = await userService.updateUserProfileByUserIdAndData(
      +req.user?.id,
      data
    );
    delete result.password;
    res.status(201).json({ ...result });
  } catch (error) {
    next(error);
  }
};

userController.getCart = async (req, res, next) => {
  try {
    const cartUser = await userService.findCartUserByUserId(+req.user.id);
    const allProduct = await userService.getAllProduct();
    const data = cartUser.map((item) => {
      item.productDetail = allProduct.find(
        (product) => product.id === item.productId
      );
      return item;
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
userController.createCart = async (req, res, next) => {
  try {
    if (!req.body?.productId || !req.body?.amount) {
      createError({
        message: "Bad Request",
        statusCode: 400,
      });
    }

    const checkData = await userService.findCartItembyUserIdAndProductId(
      +req.user.id,
      req.body?.productId
    );
    if (checkData) {
      const data = await userService.editAmountInCartItemById(
        checkData.id,
        req.body.amount + checkData.amount
      );
      const allProduct = await userService.getAllProduct();
      data.productDetail = allProduct.find(
        (product) => product.id === data.productId
      );

      res.status(200).json(data);
    }
    const input = { ...req.body, userId: +req.user.id };
    const data = await userService.createCartItem(input);
    const allProduct = await userService.getAllProduct();
    data.productDetail = allProduct.find(
      (product) => product.id === data.productId
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
userController.editCart = async (req, res, next) => {
  try {
    if (!req.body?.productId || !req.body?.amount) {
      createError({
        message: "Bad Request",
        statusCode: 400,
      });
    }

    const checkData = await userService.findCartItembyUserIdAndProductId(
      +req.user.id,
      req.body?.productId
    );
    console.log(checkData);
    if (!checkData) {
      createError({
        message: "cart not Found",
        statusCode: 400,
      });
    }
    const data = await userService.editAmountInCartItemById(
      checkData.id,
      req.body.amount
    );
    const allProduct = await userService.getAllProduct();
    data.productDetail = allProduct.find(
      (product) => product.id === data.productId
    );
    res.status(200).json({ ...data });
  } catch (error) {
    next(error);
  }
};
userController.removeCart = async (req, res, next) => {
  try {
    const checkCart = await userService.findCartById(+req.params?.cartId);
    if (!checkCart) {
      createError({
        message: "cart not Found",
        statusCode: 400,
      });
    }
    await userService.removeCartByCardId(+req.params?.cartId);
    res.status(200).json();
  } catch (error) {
    next(error);
  }
};
userController.postOrder = async (req, res, next) => {
  try {
    if (
      !req.body?.address ||
      !req.body?.phone ||
      !req.body?.firstName ||
      !req.body?.lastName ||
      !req.file?.path ||
      !req.body?.price
    ) {
      createError({
        message: "The information is not complete",
        statusCode: 400,
      });
    }

    const cartUser = await userService.findCartByUserId(req.user.id);
    if (cartUser.length === 0) {
      createError({
        message: "cart user is empty",
        statusCode: 404,
      });
    }
    const data = { ...req.body, userId: req.user?.id, price: +req.body.price };

    data.slipImage = await uploadService.upload(req.file?.path);
    const order = await userService.createOrder(data);

    const orderItemData = cartUser.map((item) => ({
      productId: item.productId,
      amount: item.amount,
      orderId: order.id,
    }));

    const orderItem = await userService.createManyOrderItem(orderItemData);
    const result2 = await userService.removeManyCartItemByUserId(req.user.id);
    await sentLineMassage(order, req.file?.path, cartUser);

    res.status(200).json({ ...order });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};
userController.getAllOrder = async (req, res, next) => {
  try {
    const orderUser = await userService.getAllOrder();
    res.status(200).json(orderUser);
  } catch (error) {
    next(error);
  }
};
userController.getOrderDetail = async (req, res, next) => {
  try {
    const orderUser = await userService.findOrderItemByOrderId(
      +req.params.orderId
    );
    const allProduct = await userService.getAllProduct();

    const data = orderUser.map((item) => {
      item.productDetail = allProduct.find(
        (product) => product.id === item.productId
      );
      return item;
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
userController.getPendingOrder = async (req, res, next) => {
  try {
    const pendingOrder = await userService.findOrderStatusPendingByUserId(
      +req.user?.id
    );
    res.status(200).json(pendingOrder);
  } catch (error) {
    next(error);
  }
};

userController.getAllOrderUser = async (req, res, next) => {
  try {
    const pendingOrder = await userService.findOrderByUserId(+req.user?.id);
    res.status(200).json(pendingOrder);
  } catch (error) {
    next(error);
  }
};

module.exports = userController;
