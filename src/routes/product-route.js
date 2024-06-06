const express = require('express');
const isAdmin = require('../middlewares/isAdmin');
const productController = require('../controllers/product-controller');
const upload = require('../middlewares/upload');
const authenticate = require('../middlewares/authenticatel');
const productRouter = express.Router();

productRouter.get('/',productController.getAllProduct)

productRouter.post('/',authenticate,isAdmin,upload.single('image'),productController.createProduct)
productRouter.patch('/',authenticate,isAdmin,upload.single('image'),productController.editProduct)
productRouter.delete('/:id',authenticate,isAdmin ,productController.deleteProduct)

module.exports = productRouter