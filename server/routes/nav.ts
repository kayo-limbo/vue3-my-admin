import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.get('/', async (_req, res) => {
  try {
    const data = await prisma.nav.findMany({
      orderBy: [{ order_index: 'asc' }, { id: 'asc' }]
    })

    res.json({
      code: 200,
      data
    })
  } catch (error) {
    console.error('nav list error:', error)
    res.status(500).json({
      code: 500,
      message: '获取快捷入口失败'
    })
  }
})

export default router
