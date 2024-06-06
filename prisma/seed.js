const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create some users
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      phone: '1234567890',
      password: 'password1',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      isAdmin: false,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      phone: '0987654321',
      password: 'password2',
      firstName: 'Jane',
      lastName: 'Smith',
      address: '456 Elm St',
      isAdmin: false,
    },
  });

  // Create some products
  const product1 = await prisma.product.create({
    data: {
      productName: 'Product 1',
      description: 'Description for Product 1',
      price: 29.99,
      image: 'product1.jpg',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      productName: 'Product 2',
      description: 'Description for Product 2',
      price: 49.99,
      image: 'product2.jpg',
    },
  });

  // Create some cart items
  const cartItem1 = await prisma.cartItem.create({
    data: {
      userId: user1.id,
      productId: product1.id,
      amount: 2,
    },
  });

  const cartItem2 = await prisma.cartItem.create({
    data: {
      userId: user2.id,
      productId: product2.id,
      amount: 1,
    },
  });

  // Create some orders
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      addressId: user1.id,
      phone: '1234567890',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      massage: 'Please deliver after 5 PM.',
      slipImage: 'slip1.jpg',
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user2.id,
      addressId: user2.id,
      phone: '0987654321',
      firstName: 'Jane',
      lastName: 'Smith',
      address: '456 Elm St',
      massage: 'Leave at the front door.',
      slipImage: 'slip2.jpg',
    },
  });

  // Create some order items
  const orderItem1 = await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      productId: product1.id,
      amount: 2,
      price: 29.99,
    },
  });

  const orderItem2 = await prisma.orderItem.create({
    data: {
      orderId: order2.id,
      productId: product2.id,
      amount: 1,
      price: 49.99,
    },
  });
}

main()
  .then(() => {
    console.log('Data seeded...');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
