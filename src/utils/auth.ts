//假登录状态
export const isLogin = () => {
  return localStorage.getItem('token')
}
export const setToken = () => {
  return localStorage.setItem('token', '123')
}
export const removeToken = () => {
  return localStorage.removeItem('token')
}