/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfoApi } from '@/api/user'

/**
 * 1. 定义后端接口返回结构
 */
interface UserInfoResponse {
  code: number;
  data: {
    username: string;
    rulesName: string[]; // 后端字段名
  };
  message?: string;
}

/**
 * 2. 使用 Setup Store 语法 (推荐)
 * 这种写法可以彻底避开 'this' 指向不明导致的类型报错
 */
export const useUserStore = defineStore('user', () => {
  // --- 状态 (State) ---
  const userInfo = ref<{ username?: string } | null>(null)
  const token = ref(localStorage.getItem('token') || '')
  const asideWidth = ref('250px')
  const menus = ref<any[]>([])
  const ruleNames = ref<string[]>([]) // 前端使用的权限数组

  // --- 逻辑 (Actions) ---

  /**
   * 获取并同步用户权限
   */
  const fetchUserPermissions = async () => {
    try {
      // 显式断言类型，解决 AxiosResponse 上不存在 code 的报错
      const response = await getUserInfoApi() as unknown as UserInfoResponse
      
      if (response.code === 200) {
        const { username, rulesName } = response.data
        
        // Setup 语法直接修改 .value，无需 this
        userInfo.value = { username }
        ruleNames.value = rulesName || []
        
        console.log('✅ 权限同步成功:', ruleNames.value)
        return ruleNames.value
      }
    } catch (error) {
      console.error('❌ 获取权限失败:', error)
      throw error
    }
  }

  /**
   * 设置 Token
   */
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  /**
   * 切换侧边栏宽度
   */
  const handleAsideWidth = () => {
    asideWidth.value = asideWidth.value === '250px' ? '64px' : '250px'
  }

  /**
   * 重置状态 (退出登录)
   */
  const resetState = () => {
    userInfo.value = null
    token.value = ''
    ruleNames.value = []
    localStorage.removeItem('token')
  }

  return {
    userInfo,
    token,
    asideWidth,
    menus,
    ruleNames,
    fetchUserPermissions,
    setToken,
    handleAsideWidth,
    resetState
  }
})


export default useUserStore