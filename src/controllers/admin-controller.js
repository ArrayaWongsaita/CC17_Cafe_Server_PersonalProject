const adminService = require("../services/admin-service")

const adminController = {}


adminController.getAllOrder = async (req, res, next) => {
  try {
    const allOrder = await adminService.getAllOrder()
  res.status(200).json(allOrder)
  } catch (error) {
    next(error)
  }
}
adminController.getAllPendingOrder = async (req, res, next) => {
  try {
    const allOrder = await adminService.getAllOrderPending()
  res.status(200).json(allOrder)
  } catch (error) {
    next(error)
  }
}
adminController.editOrder = async (req, res, next) => {
  try {
    
  res.status(200).json({massage:"done"})
  } catch (error) {
    next(error)
  }
}



module.exports = adminController