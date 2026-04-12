import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    name: "admin",
    redirect: '/dashboard',
    component: () => import('@/layouts/admin.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: 'goods/list',
        component: () => import('@/views/goods/list.vue'),
        meta: {
          title: '商品管理'
        }
      },
      {
        path: 'goods/good',
        component: () => import('@/views/goods/good.vue'),
        meta: {
          title: '商品详情'
        }
      },
      {
        path: 'goods/category',
        component: () => import('@/views/goods/category.vue'),
        meta: {
          title: '商品分类'
        }
      },
      {
        path: 'image/list',
        component: () => import('@/views/image/list.vue'),
        meta: {
          title: '图片管理'
        }
      },
      {
        path: 'user/list',
        component: () => import('@/views/user/list.vue'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: 'user/level',
        component: () => import('@/views/user/level.vue'),
        meta: {
          title: '用户等级'
        }
      },
      {
        path: 'order/list',
        component: () => import('@/views/order/list.vue'),
        meta: {
          title: '订单管理'
        }
      },
      {
        path: 'order/comment',
        component: () => import('@/views/order/comment.vue'),
        meta: {
          title: '订单评论'
        }
      },
      {
        path: 'notice/list',
        component: () => import('@/views/notice/list.vue'),
        meta: {
          title: '通知管理'
        }
      },
      {
        path: 'setting',
        component: () => import('@/views/setting/base.vue'),
        meta: {
          title: '个人设置'
        }
      },
      {
        path: 'setting/base',
        component: () => import('@/views/setting/base.vue'),
        meta: {
          title: '基本设置'
        }
      },
      {
        path: 'setting/buy',
        component: () => import('@/views/setting/buy.vue'),
        meta: {
          title: '购买设置'
        }
      },
      {
        path: 'setting/ship',
        component: () => import('@/views/setting/ship.vue'),
        meta: {
          title: '配送设置'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    localStorage.removeItem('token')
    next('/login')
  } else {
    let title = to.meta.title as string
    document.title = title ? `${title} - 后台管理系统` : '后台管理系统'
    next()
  }
})

export default router