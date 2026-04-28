import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const now = new Date()
  const items = []
  // 生成 7 天的测试数据
  for (let i = 0; i < 7; i++) {
    items.push({
      createdAt: new Date(now.getTime() - i * 24 * 60 * 60 * 1000),
      status: Math.floor(Math.random() * 3),
      amount: parseFloat((Math.random() * 200).toFixed(2)),
    })
  }

  const res = await prisma.order.createMany({ data: items })
  console.log('Seed completed, created:', res.count)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
