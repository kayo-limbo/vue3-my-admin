import express, { type RequestHandler } from 'express'
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

app.use(cors()) //允许跨域请求
app.use(express.json()) //解析json请求体

// 获取用户列表：必须带有效 JWT（示例：受保护接口）
app.get('/users', requireAuth, async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, createdAt: true }
  })
  res.json(users)
})
//接口：注册新用户
app.post('/register', async (req, res) => {
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
})

// 登录（与 Prisma 用户表对接，返回 JWT）
app.post('/login', async (req, res) => {
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
    const token = jwt.sign(
      { sub: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
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
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})