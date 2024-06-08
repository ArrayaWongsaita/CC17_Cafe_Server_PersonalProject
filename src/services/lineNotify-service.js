const lineNotify = require("../config/lineNotify");
const fs = require('fs/promises');
// const FormData = require('form-data');
const prisma = require("../models/prisma");


module.exports  = sentLineMassage = async (data,imagePath,cartUser) => {

try {
  const allProductDetail = await prisma.product.findMany({})

  
  const updatedCartUser = cartUser.map(cartItem => {
    const product = allProductDetail.find(product => product.id === cartItem.productId);
    return {
      ...cartItem,
      productName: product ? product.productName : null
    };
  });


  const productsMessage = updatedCartUser.map(item => 
  `Product: ${item.productName}
  Amount: ${item.amount}

  `).join('\n');


  const message = 
  `
  Order form: ${data.firstName} ${data.lastName}

  Phone:  ${data.phone}

  Address:  ${data.address}

  Price: ${data.price} THB

  ----------------------
  ${productsMessage}
  ----------------------
  `;


  const imageBuffer = await fs.readFile(imagePath);


  const formData = new FormData();
  formData.append('message', message);
  formData.append('imageFile', imageBuffer, { filename: 'image.jpg', contentType: 'image/jpeg' });

  return lineNotify(formData)
} catch (error) {
  console.log(error)
  return
}
}
