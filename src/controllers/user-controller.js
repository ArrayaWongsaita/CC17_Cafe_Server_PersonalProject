
const uploadService = require("../services/upload-service")
const userService = require("../services/user-service")
const createError = require("../utils/create-error")
const fs = require('fs/promises')
const sentLineMassage = require("../services/lineNotify-service")

const userController = {}

userController.getCart = async (req, res, next) => {
  try {
    const cartUser = await userService.findCartUserByUserId(+req.user.id)
    res.status(200).json(cartUser)
  } catch (error) {
    next(error)
  }
}
userController.createCart = async (req, res, next) => {
  try {
    if(!req.body?.productId || !req.body?.amount){
      createError({
        message: "Bad Request",
        statusCode: 400,
      })
    }

    const checkData = await userService.findCartItembyUserIdAndProductId(+req.user.id,req.body?.productId)
    if(checkData){
      const data = await userService.editAmountInCartItemById(checkData.id,(req.body.amount + checkData.amount))
      return res.status(200).json({...data})
    }
    const data = {...req.body ,userId:+req.user.id}
    const result = await userService.createCartItem(data)
    console.log(result)
    res.status(200).json({...result})
  } catch (error) {
    next(error)
  }
}
userController.editCart = async (req, res, next) => {
  try {
    if(!req.body?.productId || !req.body?.amount){
      createError({
        message: "Bad Request",
        statusCode: 400,
      })
    }

    const checkData = await userService.findCartItembyUserIdAndProductId(+req.user.id,req.body?.productId)
    console.log(checkData)
    if(!checkData){
      createError({
        message: "cart not Found",
        statusCode: 400,
      })
    }
    const data = await userService.editAmountInCartItemById(checkData.id,(req.body.amount))
    res.status(200).json({...data})

  } catch (error) {
    next(error)
  }
}
userController.removeCart = async (req, res, next) => {
  try {
    const checkCart = await userService.findCartById(+req.params?.cartId)
    if(!checkCart){
      createError({
        message: "cart not Found",
        statusCode: 400,
      })
    }
    await userService.removeCartByCardId(+req.params?.cartId)
    res.status(200).json()
  } catch (error) {
    next(error)
  }
}
userController.postOrder = async (req, res, next) => {
  try {


    if(!req.body?.address || !req.body?.phone || !req.body?.firstName || !req.body?.lastName || !req.file?.path || !req.body?.price){
      createError({
        message: "The information is not complete",
        statusCode: 400,
      })
    }

    const cartUser = await userService.findCartByUserId(req.user.id)
    if(cartUser.length === 0){
      createError({
        message: "cart user is empty",
        statusCode: 404,
      })
    }
    const data = {...req.body,userId:req.user?.id,price:+req.body.price}

    data.slipImage = await uploadService.upload(req.file?.path)
    const order = await userService.createOrder(data)



    const orderItemData = cartUser.map(item => ({
      productId: item.productId,
      amount: item.amount,
      orderId: order.id
    }));

    const orderItem = await userService.createManyOrderItem(orderItemData)
    const result2 = await userService.removeManyCartItemByUserId(req.user.id)
    await sentLineMassage(order,req.file?.path,cartUser)

    res.status(200).json({message:"Succeed"})
  } catch (error) {
    next(error)
  }    finally {
    if(req.file){
      fs.unlink(req.file.path)
    }
  }



}
userController.getAllOrder = async (req, res, next) => {
  try {
    const orderUser = await userService.findOrderByUserId(+req.user?.id)
    res.status(200).json(orderUser)
    
  } catch (error) {
    next(error)
  }
}
userController.getPendingOrder = async (req, res, next) => {
  try {
    const pendingOrder = await userService.findOrderStatusPendingByUserId(+req.user?.id)
    res.status(200).json(pendingOrder)
    
  } catch (error) {
    next(error)
  }
}


module.exports = userController