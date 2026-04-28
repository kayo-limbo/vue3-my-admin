import express, { type RequestHandler } from 'express'
import orderRoutes from './routes/orders'
import menuRoutes from './routes/menus'
import dashboardRoutes from './routes/dashboard'
import navRoutes from './routes/nav'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
/** 与 jwt.sign 时写入的 payload 一致，供路由里使用 */
export type JwtUserPayload = {
  sub: number
  email: string
  username: string
}

declare module 'express-serve-static-core' {
  interface Request {
    authUser?: JwtUserPayload
  }
}

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/orders', orderRoutes)
app.use('/api/menus', menuRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/nav', navRoutes)

// 打印当前 Node 进程 PID，便于确认哪个进程在监听端口
console.log('[server] pid=', process.pid)

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me'

/**
 * 后端校验 JWT：从 Authorization: Bearer <token> 取令牌，
 * 用与签发时相同的 JWT_SECRET 做 jwt.verify；失败则 401。
 * 通过后把解析出的用户信息挂在 req.authUser 上。
 */
const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未登录或缺少令牌' })
  }
  const token = header.slice(7).trim()
  if (!token) {
    return res.status(401).json({ message: '未登录或缺少令牌' })
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & JwtUserPayload
    req.authUser = {
      sub: Number(decoded.sub),
      email: decoded.email,
      username: decoded.username
    }
    next()
  } catch {
    return res.status(401).json({ message: '登录已失效，请重新登录' })
  }
}

// 跨域与 JSON 解析中间件（已在文件顶部注册）

// 获取用户列表：必须带有效 JWT（示例：受保护接口）
app.get('/users', requireAuth, async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, createdAt: true }
  })
  res.json(users)
})
// 接口：注册新用户（兼容 /register 与 /api/register）
const registerHandler: RequestHandler = async (req, res) => {
  const { username, email, password } = req.body
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password
      }
    })
    res.json({ message: '注册成功', user: newUser })
  } catch (error) {
    res.status(500).json({ message: '注册失败', error })
  }
}
app.post('/register', registerHandler)
app.post('/api/register', registerHandler)

// 登录（与 Prisma 用户表对接，返回 JWT；兼容 /login 与 /api/login）
const loginHandler: RequestHandler = async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string }
  if (!email?.trim() || !password) {
    return res.status(400).json({ message: '请输入邮箱和密码' })
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.trim() }
    })
    if (!user || user.password !== password) {
      return res.status(401).json({ message: '邮箱或密码错误' })
    }
    //登录成功时签发JWT令牌
    const token = jwt.sign(
      { sub: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    //返回token和用户信息
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    })
  } catch {
    res.status(500).json({ message: '登录失败' })
  }
}
app.post('/login', loginHandler)
app.post('/api/login', loginHandler)

const PORT = Number(process.env.PORT ?? 3001)
// 调试接口：列出已注册路由（开发用）
app.get('/__routes', (req, res) => {
  try {
    const routes: string[] = []
    // @ts-ignore access Express internals for debugging
    app._router.stack.forEach((layer: any) => {
      if (layer.route && layer.route.path) {
        const methods = Object.keys(layer.route.methods).join(',')
        routes.push(`${methods.toUpperCase()} ${layer.route.path}`)
      } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
        layer.handle.stack.forEach((l: any) => {
          if (l.route && l.route.path) {
            const methods = Object.keys(l.route.methods).join(',')
            // layer.regexp may show the mount path; include it if available
            routes.push(`${methods.toUpperCase()} ${l.route.path}`)
          }
        })
      }
    })
    res.json({ routes })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
