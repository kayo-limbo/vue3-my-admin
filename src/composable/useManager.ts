import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'
import { onMounted } from 'vue'
import { serverApi } from '@/utils/request'
import { updatePassword } from '@/api/user'

type ApiResponse<T> = {
  code: number
  data: T
  message?: string
}

export const usehanlelogout = () => {
  const store = useStore()
  const router = useRouter()
  const handleLogout = () => {
    store.commit('RESET_STATE')
    localStorage.clear()
    sessionStorage.clear()
    ElMessage.success('退出登录成功')
    router.replace('/login')
  }
  return {
    handleLogout
  }
}

export const userefreshpassword = () => {
  const showEditPassword = ref(false)
  const formRef = ref()
  const form = reactive({
    oldPassword: '',
    newPassword: '',
    rePassword: '',
  })
  const openPasswordDialog = () => {
    form.oldPassword = ''
    form.newPassword = ''
    form.rePassword = ''
    showEditPassword.value = true
  }
  const { handleLogout } = usehanlelogout()
  const onSubmit = () => {
    if (!formRef.value) return
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        if (form.newPassword !== form.rePassword) {
          ElMessage.error('两次输入密码不一致')
          return
        }
        updatePassword(form.newPassword).then(() => {
          ElMessage.success('修改密码成功,请重新登录')
          showEditPassword.value = false
          handleLogout()
        }).catch((error: any) => {
          console.error('修改密码失败:', error)
          ElMessage.error('修改密码失败，请稍后重试')
        })
      } else {
        ElMessage.error('请检查输入信息')
        return false
      }
    })
  }
  const rules = {
    oldPassword: [
      { required: true, message: '请输入旧密码', trigger: 'blur' },
    ],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
    ],
    rePassword: [
      { required: true, message: '请确认新密码', trigger: 'blur' },
    ],
  }
  return {
    form,
    formRef,
    showEditPassword,
    openPasswordDialog,
    onSubmit,
    rules
  }
}

export const usehandleRefresh = () => {
  const handleRefresh = () => {
    location.reload()
  }
  return {
    handleRefresh
  }
}

interface DashboardOrder {
  id: number
  title: string
  unit: string
  unit_color: string | null
  value: number | null
  sub_title: string | null
  sub_value: string | null
  order_index: number | null
}

export function orderList() {
  const statsList = ref<DashboardOrder[]>([])
  const loading = ref(false)

  const fetchStatsList = async () => {
    loading.value = true
    try {
      const { data } = await serverApi.get<ApiResponse<DashboardOrder[]>>('/api/orders/stats')
      statsList.value = Array.isArray(data?.data) ? data.data : []
    } catch (error: any) {
      console.error('获取顶部统计失败:', error?.response?.data || error)
      statsList.value = []
      ElMessage.error('获取顶部统计失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchStatsList()
  })

  return {
    statsList,
    loading,
    fetchStatsList
  }
}

interface DashboardMenus {
  id: number
  title: string
  icon: string | null
  color: string | null
  path: string | null
  order_index: number | null
}

export function useDashboardMenus() {
  const menusList = ref<DashboardMenus[]>([])
  const loading = ref(false)

  const fetchMenusList = async () => {
    loading.value = true
    try {
      const { data } = await serverApi.get<ApiResponse<DashboardMenus[]>>('/api/nav')
      menusList.value = Array.isArray(data?.data) ? data.data : []
    } catch (error: any) {
      console.error('获取快捷入口失败:', error?.response?.data || error)
      menusList.value = []
      ElMessage.error('获取快捷入口失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchMenusList()
  })

  return {
    menusList,
    loading,
    fetchMenusList
  }
}

export function useOrderChart() {
  const xAxisData = ref<string[]>([])
  const yAxisData = ref<number[]>([])
  type ChartRange = 'day' | 'week' | 'month'

  const fetchChartData = async (range: ChartRange = 'week') => {
    try {
      const { data } = await serverApi.get<ApiResponse<Array<{ label: string; value: number }>>>('/api/orders/stats', {
        params: { type: range }
      })

      const list = Array.isArray(data?.data) ? data.data : []
      xAxisData.value = list.map((item) => item.label)
      yAxisData.value = list.map((item) => item.value)
    } catch (error: any) {
      console.error('获取图表数据失败:', error?.response?.data || error)
      xAxisData.value = []
      yAxisData.value = []
      ElMessage.error('获取订单图表数据失败，请稍后重试')
    }
  }

  return { xAxisData, yAxisData, fetchChartData }
}

interface ShopTip {
  id: number
  title: string
  status: number | null
  stock: number | null
}

export function useShopTips() {
  const tips = ref<ShopTip[]>([])
  const loading = ref(false)

  const fetchTipsList = async () => {
    loading.value = true
    try {
      const { data } = await serverApi.get<ApiResponse<ShopTip[]>>('/api/dashboard/goods')
      tips.value = Array.isArray(data?.data) ? data.data : []
    } catch (error: any) {
      console.error('获取店铺提示失败:', error?.response?.data || error)
      tips.value = []
      ElMessage.error('获取店铺提示失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchTipsList()
  })

  return {
    tips,
    loading,
    fetchTipsList
  }
}

interface TransactionTip {
  id: number
  createdAt: string
  title: string | null
  status: number | null
  amount: number | null
}

export function useTransactionTips() {
  const transactionTips = ref<TransactionTip[]>([])
  const loading = ref(false)

  const fetchTipsList = async () => {
    loading.value = true
    try {
      const { data } = await serverApi.get<ApiResponse<TransactionTip[]>>('/api/dashboard/stats')
      transactionTips.value = Array.isArray(data?.data) ? data.data : []
    } catch (error: any) {
      console.error('获取交易提示失败:', error?.response?.data || error)
      transactionTips.value = []
      ElMessage.error('获取交易提示失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchTipsList()
  })

  return {
    transactionTips,
    loading,
    fetchTipsList
  }
}
