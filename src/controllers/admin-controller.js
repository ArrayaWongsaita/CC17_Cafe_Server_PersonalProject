const adminService = require("../services/admin-service");
const fs = require("fs/promises");
const createError = require("../utils/create-error");
const uploadService = require("../services/upload-service");
const removeService = require("../services/remove-service");
const adminController = {};

adminController.getAllOrder = async (req, res, next) => {
  try {
    const allOrder = await adminService.getAllOrder();
    res.status(200).json(allOrder);
  } catch (error) {
    next(error);
  }
};
adminController.getAllPendingOrder = async (req, res, next) => {
  try {
    const allOrder = await adminService.getAllOrderPending();
    res.status(200).json(allOrder);
  } catch (error) {
    next(error);
  }
};
adminController.editOrder = async (req, res, next) => {
  try {
  
    if (
      !req.body?.orderId ||
      !(req.body?.address ||
        req.body?.phone ||
        req.body?.firstName ||
        req.body?.lastName ||
        req.file?.path ||
        req.body?.price)
    ){
      createError({
        message: "Incomplete information ",
        statusCode: 400,
      })
    }
    const data = req.body

    if(data.price) data.price = +data.price
    if(req?.file){
      req.oldImage = await adminService.findSlipImageByOrderId(+data.orderId)

      console.log(req.oldImage)
      data.slipImage = await uploadService.upload(req.file?.path)
    }
    const orderId = +data.orderId
    delete data.orderId 
    console.log(data)
    console.log(orderId)
    const result = await adminService.editOrderByOrderId(orderId,data)


      res.status(200).json(result);
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {

      fs.unlink(req.file.path);
    }
    if (req?.oldImage) {
      const oldImage = req.oldImage.split("/");
      const path = oldImage[oldImage.length - 1].split(".")[0];
      console.log(removeService.remove(path));
    }
  }
};

module.exports = adminController;
