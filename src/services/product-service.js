const { date } = require("joi");
const prisma = require("../models/prisma");

const productService = {}

productService.getAllProduct = () => prisma.product.findMany({
  orderBy: {id: 'desc'}
})
productService.checkByProductName = (productName) => prisma.product.findMany({
  where: {productName}
})
productService.checkById = (id) => prisma.product.findMany({
  where: {id}
})
productService.findImageById = async (id) =>{ 
  const result = await prisma.product.findMany({
  where: {id}
})
  return result[0]?.image || false
}

productService.createProduct = (data) => prisma.product.create({
  data
})


productService.upDataProductByIdAndData = (id, data) => prisma.product.update({
  where: {id},
  data
})

productService.dropColumnById = id => prisma.product.delete({
  where: {id}
})

module.exports = productService