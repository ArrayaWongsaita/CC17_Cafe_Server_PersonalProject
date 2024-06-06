const productService = require("../services/product-service")
const fs = require('fs/promises')
const createError = require("../utils/create-error")
const uploadService = require("../services/upload-service")
const removeService = require("../services/remove-service")
const productController = {}


productController.getAllProduct = async (req, res, next ) => {
  try {
    const result = await productService.getAllProduct()
    const resultFilter = result.filter(item => item.isShow === true)
    const products = resultFilter.map(item => {
      delete item.isShow
      return item
    })
    res.status(200).json({products})
  } catch (error) {
    next(error)
  }
}



productController.createProduct = async (req, res, next ) => {
  try {
    if(Object.keys(req?.body).length !== 3 || !req?.file){
      createError({
        message: "Incomplete information ",
        statusCode: 400,
      })
    }


    const checkProductName = await productService.checkByProductName(req?.body.productName)
    if(checkProductName.length > 0){
      createError({
        message: "Product name  already exists ",
        statusCode: 400,
      })
    }

    const data = {...req?.body,price:+req?.body.price}
    data.image = await uploadService.upload(req.file?.path)

    
    const massage = await productService.createProduct(data)
    res.status(200).json(massage)

  } catch (error) {
    next(error)
  } finally {
    if(req.file){
      fs.unlink(req.file.path)
    }
  }
}


productController.editProduct = async (req, res, next ) => {
  try {
    if(Object.keys(req?.body).length < 2 || !req.body?.id ){
      createError({
        message: "Incomplete information ",
        statusCode: 400,
      })
    }

    const isHaveId = await productService.checkById(+req.body?.id)
    if(isHaveId.length === 0){
      createError({
        message: "Id is not found",
        statusCode: 400,
      })
    }

    const data = {...req?.body}
    console.log(data)
    if(data?.isShow){
      console.log(typeof(data.isShow))
      data.isShow = data.isShow == "true" ? true : false;
    }
    if(data?.productName){
      const checkProductName = await productService.checkByProductName(req?.body.productName)
      if(checkProductName.length > 0){
        createError({
          message: "Product name  already exists ",
          statusCode: 400,
        })
      }
    }

    if(data?.price){
      data.price = +data.price
    }
    if(req?.file){
      req.oldImage = await productService.findImageById(+data.id)
      data.image = await uploadService.upload(req.file?.path)
    }
    const id = +data.id
    delete data.id
    const {count} = await productService.upDataProductByIdAndData(id,data)

    if(count){
      res.status(200).json({massage:"Edit successful"})
    }else{
      res.status(400).json({massage:"Id is not found"})
    }
  } catch (error) {
    next(error)
  } finally {
    if(req.file){
      fs.unlink(req.file.path)
    }
    if(req?.oldImage){
      const oldImage = req.oldImage.split('/')
      const path = (oldImage[oldImage.length -1]).split(".")[0]
      console.log(removeService.remove(path))
    }
  }

}
productController.deleteProduct = async (req, res, next ) => {
  try {
    if(!req.params?.id){
      createError({
        message: `params id is ${req.params?.id}`,
        statusCode: 400,
      })

    }
    const isHaveId = await productService.checkById(+req.params.id)
    if(isHaveId.length === 0){
      createError({
        message: "Id is not found",
        statusCode: 400,
      })
    }
     const massage = await productService.dropColumnById(+req.body?.id)

    res.status(200).json()
  } catch (error) {
    next(error)
  }
}


module.exports = productController;

