import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
// import Login from '@/views/login/index.vue'
import AdminLayout from '@/layouts/admin.vue'
import DashBoard from '@/views/dashboard/index.vue'
import User from '@/views/user/index.vue'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard',
        component: DashBoard,
        meta: {
          title: '首页'
        }
      },
      {
        path: 'user',
        component: User,
        meta: {
          title: '用户管理'
        }
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
// import { isLogin } from '@/utils/auth'
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    let title = to.meta.title as string
    document.title = title ? `${title} - 后台管理系统` : '后台管理系统'
    next()
  }
})
export default router