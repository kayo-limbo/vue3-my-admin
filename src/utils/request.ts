import router from '@/router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
const service = axios.create({
  baseURL: `${import.meta.env.VITE_SUPABASE_URL}/rest/v1`,
  headers: {
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY?.trim(),
    'Content-Type': 'application/json'
  }
})
//请求拦截器
// 请求拦截器
// 1. 请求拦截器：确保每一个字段都安全
service.interceptors.request.use(
  (config) => {
    // 获取环境变量里的 apikey
    const apikey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (apikey) {
      // 过滤掉所有非英文字符，确保符合 ISO-8859-1 标准
      config.headers['apikey'] = apikey.trim().replace(/[^\x00-\x7F]/g, "");
    }

    // 获取登录后统一存储的 token
    const token = localStorage.getItem('token');
    // 增加判断：只有 token 真的存在且不是字符串 "null" 时才挂载
    if (token && token !== 'null' && token !== 'undefined') {
      const cleanToken = token.trim().replace(/[^\x00-\x7F]/g, "");
      config.headers['Authorization'] = `Bearer ${cleanToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 2. 响应拦截器：防止闪退死循环
service.interceptors.response.use(
  (res) => {
    // Supabase 正常返回的数据在 res.data 里
    return res.data;
  },
  (err) => {
    // 关键：先看看是不是 401
    if (err.response?.status === 401) {
      // 如果当前已经在登录页了，就不要再跳转了，防止死循环
      if (router.currentRoute.value.path !== '/login') {
        localStorage.removeItem('token');
        router.push('/login');
        ElMessage.error('登录失效，请重新登录');
      }
    } else {
      // 其他错误（比如 400, 404, 500）只提示，不退回登录
      const msg = err.response?.data?.message || '请求失败';
      ElMessage.error(msg);
    }

    return Promise.reject(err);
  }
);

/**
 * 自建后端（Express + Prisma 等），与 Supabase 使用不同 baseURL。
 * 开发环境在 `vite.config` 里把 `/local-api` 代理到本机端口（如 3000）。
 */
export const serverApi = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API ?? '/local-api',
  headers: {
    'Content-Type': 'application/json',
  },
})

serverApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && token !== 'null' && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token.trim()}`
  }
  return config
})

export default service;