// require('dotenv').config()
const {PrismaClient} =require('@prisma/client')
const prisma = new PrismaClient()

async function run() {
  await prisma.$executeRawUnsafe('DROP Database cc_17_personal_project_cafe')
  await prisma.$executeRawUnsafe('CREATE Database cc_17_personal_project_cafe')
}
console.log('Reset DB..')
run()
