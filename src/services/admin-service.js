const prisma = require("../models/prisma")

const adminService = {}

adminService.getAllOrder = () => prisma.order.findMany({})
adminService.getAllOrderPending = () => prisma.order.findMany({where: {status: "Pending"}})
adminService.findSlipImageByOrderId =  async (id) =>{ 
  const result = await prisma.product.findMany({
  where: {id}
})
  return result[0]?.slipImage || false

}

adminService.editOrderByOrderId = (id,data) => prisma.order.update({where:{id},data})


module.exports = adminService