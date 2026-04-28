import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()
console.log('[orders.routes] loaded')

router.get('/stats', async (req, res) => {
  const type = Array.isArray(req.query.type) ? req.query.type[0] : req.query.type
  console.log(`[orders.stats] incoming request, query:`, req.query)

  try {
    // 不带 type 时返回顶部统计卡片，供 dashboard 的 orderList 使用。
    if (!type) {
      const data = await prisma.dashboard_order.findMany({
        orderBy: [{ order_index: 'asc' }, { id: 'asc' }]
      })

      return res.json({
        code: 200,
        data
      })
    }

    let days = 7
    if (type === '24h' || type === 'day') days = 1
    else if (type === 'month') days = 30

    const since = new Date()
    since.setDate(since.getDate() - days)

    const rows = await prisma.order.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true }
    })

    const map = new Map<string, number>()
    for (const row of rows) {
      const date = new Date(row.createdAt)
      const label =
        type === '24h' || type === 'day'
          ? `${String(date.getHours()).padStart(2, '0')}:00`
          : `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

      map.set(label, (map.get(label) ?? 0) + 1)
    }

    const data: { label: string; value: number }[] = []
    const now = new Date()

    if (type === '24h' || type === 'day') {
      for (let hour = 0; hour < 24; hour++) {
        const label = `${String(hour).padStart(2, '0')}:00`
        data.push({ label, value: map.get(label) ?? 0 })
      }
    } else {
      const cursor = new Date(since)
      while (cursor <= now) {
        const label = `${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`
        data.push({ label, value: map.get(label) ?? 0 })
        cursor.setDate(cursor.getDate() + 1)
      }
    }

    res.json({
      code: 200,
      data
    })
  } catch (error) {
    console.error('orders stats error:', error)
    res.json({ code: 200, data: [] })
  }
})

// 调试：列出最近的若干订单，确认数据库中有数据
router.get('/list', async (req, res) => {
  try {
    const rows = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 20 })
    res.json({ code: 200, data: rows })
  } catch (err) {
    console.error('orders.list error:', err)
    res.status(500).json({ message: '列表查询失败', error: String(err) })
  }
})

// 调试：返回 orders 表的计数与若干样本行，并返回当前 DATABASE_URL 的掩码（仅用于本地调试）
router.get('/debug', async (req, res) => {
  try {
    const count = await prisma.order.count()
    const sample = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 10 })
    const rawUrl = process.env.DATABASE_URL ?? ''
    const masked = rawUrl ? rawUrl.replace(/(:\/\/).*@/, '$1***@') : ''
    res.json({ code: 200, data: { count, sample, database: masked } })
  } catch (err) {
    console.error('orders.debug error:', err)
    res.status(500).json({ message: 'debug 查询失败', error: String(err) })
  }
})

export default router
