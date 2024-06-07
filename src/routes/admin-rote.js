const express = require('express');
const adminController = require('../controllers/admin-controller');
const upload = require('../middlewares/upload');


const adminRouter = express.Router()


adminRouter.get('/',adminController.getAllOrder)
adminRouter.get('/pending',adminController.getAllPendingOrder)
adminRouter.patch('/',upload.single('slipImage'),adminController.editOrder)

module.exports = adminRouter;