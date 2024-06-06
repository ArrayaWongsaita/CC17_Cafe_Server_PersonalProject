const prisma = require("../models/prisma");

const userService = {};

userService.createUser = (data) => prisma.user.create({ data });
// userService.createUser = (data) => prisma.user.create({ data:data })
userService.findUserByEmail = (email) =>
  prisma.user.findFirst({
    where: {
       email
    },
  });


  userService.findUserById = userId => prisma.user.findUnique({where: {id: userId}})


  module.exports = userService;