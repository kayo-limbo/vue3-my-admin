import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.get('/stats', async (_req, res) => {
  try {
    const data = await prisma.dashboard_orders.findMany({
      orderBy: {
        id: 'asc'
      }
    })

    res.json({
      code: 200,
      data
    })
  } catch (error) {
    console.error('dashboard stats error:', error)
    res.status(500).json({
      code: 500,
      message: '获取 dashboard 统计数据失败'
    })
  }
})

router.get('/goods', async (_req, res) => {
  try {
    const data = await prisma.dashboard_goods.findMany({
      orderBy: {
        id: 'asc'
      }
    })

    res.json({
      code: 200,
      data
    })
  } catch (error) {
    console.error('dashboard goods error:', error)
    res.status(500).json({
      code: 500,
      message: '获取店铺及商品提示失败'
    })
  }
})

export default router
