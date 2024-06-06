const {PrismaClient}  = require('@prisma/client')

const prisma = new PrismaClient({ log: ['query']})
// const prisma = new PrismaClient()

module.exports = prisma;