import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

type DbMenu = {
  id: number
  name: string
  icon: string | null
  url?: string | null
  frontpath?: string | null
  parentId?: number | null
  parent_id?: number | null
  order?: number | null
}

const normalizeMenu = (item: DbMenu) => ({
  id: item.id,
  name: item.name,
  icon: item.icon ?? '',
  frontpath: item.frontpath ?? item.url ?? '',
  parent_id: item.parent_id ?? item.parentId ?? null,
  order: item.order ?? 0,
})

router.get('/', async (_req, res) => {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    })

    res.json(menus.map(normalizeMenu))
  } catch (prismaError) {
    try {
      const menus = await prisma.$queryRawUnsafe<DbMenu[]>(
        'SELECT id, name, icon, frontpath, parent_id, `order` FROM menus ORDER BY `order` ASC, id ASC'
      )

      res.json(menus.map(normalizeMenu))
    } catch (rawError) {
      console.error('[menus.routes] failed to load menus', { prismaError, rawError })
      res.status(500).json({ message: '获取菜单失败' })
    }
  }
})

export default router
