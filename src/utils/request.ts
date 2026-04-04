import router from '@/router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
const service = axios.create({
  baseURL: '/api',
  timeout: 5000
})
//请求拦截器
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.token = token
  }
  return config
})
//响应拦截器
service.interceptors.response.use(res => {
  return res.data
}, err => {
  if (err.response.status === 401) {
    router.push('/login')
    localStorage.removeItem('token')
    ElMessage.error('请先登录')
  }
  ElMessage.error('请求失败')
  return Promise.reject(err)
}
)

export default service