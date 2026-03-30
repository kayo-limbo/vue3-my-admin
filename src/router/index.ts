import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
// import Login from '@/views/login/index.vue'
import DashBoard from '@/views/dashboard/index.vue'
import User from '@/views/user/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/dashboard',
    component: DashBoard
  },
  {
    path: '/user',
    component: User
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
// import { isLogin } from '@/utils/auth'
router.beforeEach((to, _from, next) => {
  if (to.path !== '/login' && !localStorage.getItem('token')) {
    next('/login')
  } else {
    next()
  }
})
export default router