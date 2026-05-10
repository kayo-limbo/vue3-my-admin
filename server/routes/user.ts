import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret_key';

// 定义 Token 解析后的结构
interface DecodedToken {
  id: number;
  username: string;
  iat: number;
  exp: number;
}

/**
 * 获取用户信息及权限列表 (TypeScript 版)
 */
router.get('/info', async (req: Request, res: Response) => {
  try {
    // 1. 获取并验证 Token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ code: 401, message: '未授权' });
    }

    const token = authHeader.split(' ')[1];

    // 2. 校验 Token 并强制指定类型
    const decoded = jwt.verify(token, SECRET_KEY) as unknown as DecodedToken;
    const userId = req.authUser?.sub
    // const userId = decoded.id;

    // 3. 使用 Prisma 深度查询
    // 注意：Prisma 会自动根据你的 schema 生成对应的类型
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }

    // 4. 提取 pCode 数组 (利用 TS 的类型推导)
    const pCodes: string[] = [];

    user.roles.forEach((userRole) => {
      userRole.role.permissions.forEach((rolePermission) => {
        if (rolePermission.permission.pCode) {
          pCodes.push(rolePermission.permission.pCode);
        }
      });
    });

    // 5. 去重
    const rulesName = Array.from(new Set(pCodes));

    // 6. 返回结果
    return res.json({
      code: 200,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        rulesName: rulesName // 前端 v-permission 依赖的数据
      }
    });

  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ code: 401, message: 'Token 无效' });
    }
    console.error('TS Error:', error);
    return res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

export default router;