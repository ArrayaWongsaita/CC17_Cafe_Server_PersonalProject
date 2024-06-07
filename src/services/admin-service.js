const prisma = require("../models/prisma")

const adminService = {}

adminService.getAllOrder = () => prisma.order.findMany({})
adminService.getAllOrderPending = () => prisma.order.findMany({where: {status: "Pending"}})

module.exports = adminService