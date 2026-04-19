import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";
import { onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import { updatePassword } from "@/api/user";
export const usehanlelogout = () => {
  const store = useStore();
  const router = useRouter();
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
  title: string;
  unit: number;
  unit_color: string;
  value: number;
  sub_title: string;
  sub_value: number;
}

export function orderList() {
  const statsList = ref<DashboardOrder[]>([])
  const fetchStatsList = async () => {
    const { data, error } = await supabase.from('dashboard_order').select('*').order('order_index', { ascending: true })
    if (!error) {
      statsList.value = data || []
    }
  }
  onMounted(() => {
    fetchStatsList()
  })

  return {
    statsList,
    fetchStatsList
  }
}
interface DashboardMenus {
  icon: string;
  title: string;
  color: string;
  path: string;
}
export function useDashboardMenus() {
  const menusList = ref<DashboardMenus[]>([])
  const fetchMenusList = async () => {
    const { data, error } = await supabase.from('nav_menus').select('*').order('id', { ascending: true })
    if (!error) {
      menusList.value = data || []
      console.log(menusList.value)
    }
  }
  onMounted(() => {
    fetchMenusList()
  })

  return {
    menusList,
    fetchMenusList
  }
}
export function useOrderChart() {
  const xAxisData = ref<string[]>([])
  const yAxisData = ref<number[]>([])
  type ChartRange = 'day' | 'week' | 'month'

  const pickYAxis = (item: Record<string, any>) => {
    const value = item.amount ?? item.order_count ?? item.status ?? item.value ?? item.count ?? item.stock
    return Number(value) || 0
  }

  const getRecentCount = (range: ChartRange) => {
    if (range === 'day') return 24
    if (range === 'week') return 7
    return 30
  }

  const getTimeCutoff = (range: ChartRange) => {
    const now = Date.now()
    const hours = range === 'day' ? 24 : range === 'week' ? 24 * 7 : 24 * 30
    return now - hours * 60 * 60 * 1000
  }

  const pad2 = (value: number) => String(value).padStart(2, '0')
  const hourBucket = (date: Date) => {
    const copy = new Date(date)
    copy.setMinutes(0, 0, 0)
    return copy
  }
  const dayBucket = (date: Date) => {
    const copy = new Date(date)
    copy.setHours(0, 0, 0, 0)
    return copy
  }
  const formatHourLabel = (date: Date) => `${pad2(date.getHours())}:00`
  const formatDayLabel = (date: Date) => `${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`

  const fetchChartData = async (range: ChartRange = 'week') => {
    try {
      // 统一使用 supabase client，避免 axios 拦截器 401 影响登录态
      const { data, error } = await supabase
        .from('dashboard_orders')
        .select('*')

      if (error) {
        throw error
      }

      const rows = (data || []) as Record<string, any>[]
      const now = Date.now()
      const cutoff = getTimeCutoff(range)
      const rowsWithTime = rows
        .map((item) => {
          const rawTime = item.created_at ?? item.order_date ?? item.date
          const timestamp = new Date(rawTime).getTime()
          return { item, timestamp }
        })
        .filter((entry) => Number.isFinite(entry.timestamp))

      if (rowsWithTime.length === 0) {
        // 没有时间字段时，按最近 N 条模拟时间切换效果
        const fallbackRows = rows.slice(-getRecentCount(range))
        xAxisData.value = fallbackRows.map((_, index) => `第${index + 1}项`)
        yAxisData.value = fallbackRows.map((item) => pickYAxis(item))
        return
      }

      const inRangeRows = rowsWithTime.filter((entry) => entry.timestamp >= cutoff && entry.timestamp <= now)
      const bucketMap = new Map<number, number>()

      inRangeRows.forEach(({ item, timestamp }) => {
        const date = new Date(timestamp)
        const bucketTime = range === 'day' ? hourBucket(date).getTime() : dayBucket(date).getTime()
        const prev = bucketMap.get(bucketTime) || 0
        bucketMap.set(bucketTime, prev + pickYAxis(item))
      })

      const xList: string[] = []
      const yList: number[] = []
      const points = getRecentCount(range)
      const stepMs = range === 'day' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000
      let cursor = range === 'day' ? hourBucket(new Date()).getTime() : dayBucket(new Date()).getTime()

      for (let i = points - 1; i >= 0; i--) {
        const bucketTime = cursor - i * stepMs
        const date = new Date(bucketTime)
        xList.push(range === 'day' ? formatHourLabel(date) : formatDayLabel(date))
        yList.push(bucketMap.get(bucketTime) || 0)
      }

      xAxisData.value = xList
      yAxisData.value = yList
    } catch (error: any) {
      console.error('获取图表数据失败:', error?.message || error)
      xAxisData.value = []
      yAxisData.value = []
      ElMessage.error('获取订单图表数据失败，请稍后重试')
    }
  }

  return { xAxisData, yAxisData, fetchChartData }
}
interface ShopTip {
  title: string;
  status: number;
  stock: number;
}
export function useShopTips() {
  const tips = ref<ShopTip[]>([])
  const fetchTipsList = async () => {
    const { data, error } = await supabase
      .from('dashboard_goods')
      .select('*')
      .order('id', { ascending: true })
    if (!error) {
      tips.value = data || []
      console.log(tips.value)
    } else {
      console.error('获取店铺提示失败:', error.message)
      ElMessage.error('获取店铺提示失败，请稍后重试');
    }
  }
  onMounted(() => {
    fetchTipsList()
  })
  return {
    tips,
    fetchTipsList
  }
}
interface transactionTips {
  title: string;
  status: number;
  stock: number;
}
export function useTransactionTips() {
  const transactionTips = ref<transactionTips[]>([])
  const fetchTipsList = async () => {
    const { data, error } = await supabase
      .from('dashboard_orders')
      .select('*')
      .order('id', { ascending: true })
    if (!error) {
      transactionTips.value = data || []
      console.log(transactionTips.value)
    } else {
      console.error('获取交易提示失败:', error.message)
      ElMessage.error('获取交易提示失败，请稍后重试');
    }
  }
  onMounted(() => {
    fetchTipsList()
  })
  return {
    transactionTips,
    fetchTipsList
  }
}
