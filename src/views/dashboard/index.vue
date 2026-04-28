<template>
  <div class="p-8 pt-24 bg-gray-50 min-h-screen">
    <el-row :gutter="30" class="!mb-8">
      <el-col :span="6" v-for="(item, index) in statsList" :key="index">
        <el-card shadow="hover" class="border-none rounded-lg">
          
          <el-skeleton :loading="isLoading" animated>
            
            <template #template>
              <div class="flex justify-between items-center mb-6">
                <el-skeleton-item variant="text" style="width: 30%" />
                <el-skeleton-item variant="rect" style="width: 24px; height: 18px;" />
              </div>
              <div class="py-4">
                <el-skeleton-item variant="h1" style="width: 50%; height: 40px;" />
              </div>
              <el-divider class="my-4 opacity-50" />
              <div class="flex justify-between items-center">
                <el-skeleton-item variant="text" style="width: 40%" />
                <el-skeleton-item variant="text" style="width: 20%" />
              </div>
            </template>

            <template #default>
              <div class="flex justify-between items-center text-gray-400 mb-2">
                <span class="text-sm font-medium">{{ item.title }}</span>
                <el-tag :type="item.unit_color" size="small" effect="plain" class="rounded-md">
                  {{ item.unit }}
                </el-tag>
              </div>
              
              <div class="py-4">
                <span class="text-4xl font-bold text-slate-700">
                  <CountTo :value="item.value" />
                </span>
              </div>
              
              <el-divider class="my-4 opacity-50" />
              
              <div class="flex justify-between items-center text-sm text-gray-500">
                <span>{{ item.sub_title }}</span>
                <span>{{ item.sub_value }}</span>
              </div>
            </template>

          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>


 <el-row :gutter="25" class="!mb-8">
  <template v-if="isLoading || menusList.length === 0">
    <el-col :span="3" v-for="i in 8" :key="'skeleton-' + i">
      <el-card shadow="hover" class="border-none rounded-xl">
        <div class="flex flex-col items-center justify-center py-4">
          <el-skeleton animated>
            <template #template>
              <el-skeleton-item variant="circle" style="width: 48px; height: 48px" />
              <el-skeleton-item variant="text" style="width: 60%; margin-top: 12px" />
            </template>
          </el-skeleton>
        </div>
      </el-card>
    </el-col>
  </template>

  <template v-else>
    <el-col 
      :span="3" 
      v-for="item in menusList" 
      :key="item.id"
      @click="item.path && $router.push(item.path)"
    >
      <el-card 
        shadow="hover" 
        class="border-none rounded-xl cursor-pointer group hover:shadow-md transition-all"
      >
        <div class="flex flex-col items-center justify-center py-4">
          <div 
            class="w-12 h-12 mb-3 flex items-center justify-center rounded-xl transition-all group-hover:scale-110"
            :style="{ 
              backgroundColor: `${item.color ?? '#409EFF'}15`, 
              color: item.color ?? '#409EFF'
            }"
          >
        
            <el-icon :size="24">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <span class="text-xs font-medium text-gray-600">{{ item.title }}</span>
        </div>
        
      </el-card>
    </el-col>
  </template>

</el-row>

    
<el-row :gutter="20">
      <el-col :span="14">
        <el-card shadow="hover" class="border-none rounded-xl">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-sm font-bold text-gray-600">订单统计</span>
              <el-radio-group v-model="chartTimeRange" size="small" @change="handleTimeChange">
                <el-radio-button label="month">近1个月</el-radio-button>
                <el-radio-button label="week">近1周</el-radio-button>
                <el-radio-button label="day">近24小时</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="chartRef" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>

      <el-col :span="10">
        <div class="flex flex-col gap-4">
          <el-card shadow="hover" class="border-none rounded-xl">
            <template #header>
              <div class="flex justify-between items-center">
                <span class="text-sm font-bold text-gray-600">店铺及商品提示</span>
                <el-tag type="danger" effect="plain" size="small">店铺及商品提示</el-tag>
              </div>
            </template>
            <el-row :gutter="10">
              <el-col :span="6" v-for="item in tips" :key="item.title">
                <div class="bg-gray-50 rounded-lg py-6 flex flex-col items-center justify-center hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-blue-100">
                  <span class="text-2xl font-bold text-gray-800">{{ item.status }}</span>
                  <span class="text-xs text-gray-400 mt-2">{{ item.title }}</span>
                </div>
              </el-col>
            </el-row>
          </el-card>

          <el-card shadow="hover" class="border-none rounded-xl">
            <template #header>
              <div class="flex justify-between items-center">
                <span class="text-sm font-bold text-gray-600">交易提示</span>
                <el-tag type="danger" effect="plain" size="small">需要立即处理的交易订单</el-tag>
              </div>
            </template>
            <el-row :gutter="10">
              <el-col :span="6" v-for="item in transactionTips" :key="item.title">
                <div class="bg-gray-50 rounded-lg py-6 flex flex-col items-center justify-center hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-red-100">
                  <span class="text-2xl font-bold text-gray-800">{{ item.status }}</span>
                  <span class="text-xs text-gray-400 mt-2">{{ item.title }}</span>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import CountTo from '@/components/CountTo.vue'
import { serverApi } from '@/utils/request'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { orderList } from '@/composable/useManager'
import { useDashboardMenus } from '@/composable/useManager'
import { useShopTips } from '@/composable/useManager'
import { useTransactionTips } from '@/composable/useManager'
import * as echarts from 'echarts'

type ChartRange = 'day' | 'week' | 'month'

const { menusList, loading: menusLoading } = useDashboardMenus()
const { statsList, loading: statsLoading } = orderList()
const { tips, loading: tipsLoading } = useShopTips()
const { transactionTips, loading: transactionTipsLoading } = useTransactionTips()
const isLoading = computed(
  () =>
    menusLoading.value ||
    statsLoading.value ||
    tipsLoading.value ||
    transactionTipsLoading.value
)

const chartTimeRange = ref<ChartRange>('week')
const chartData = ref<{ label: string; value: number }[]>([])
const chartRef = ref<HTMLDivElement>()
let myChart: echarts.ECharts | null = null

const getStats = async (rangeType: ChartRange) => {
  try {
    const res = await serverApi.get('/api/orders/stats', {
      params: { type: rangeType }
    })
    const payload = res.data?.data ?? res.data
    chartData.value = Array.isArray(payload) ? payload : []
    renderChart()
  } catch (error: any) {
    console.error('获取订单统计失败:', error?.response?.status, error?.response?.data || error.message)
    chartData.value = []
    renderChart()
  }
}

const handleTimeChange = async (val: string) => {
  chartTimeRange.value = val as ChartRange
  await getStats(chartTimeRange.value)
}

const renderChart = () => {
  if (!myChart) return

  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: chartData.value.map(item => item.label),
      axisTick: { alignWithLabel: true }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '订单量',
        type: 'bar',
        barWidth: '40%',
        data: chartData.value.map(item => item.value),
        itemStyle: {
          color: '#5470c6',
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  }

  myChart.setOption(option)
}

onMounted(() => {
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value)
  }

  getStats('week')
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  myChart?.dispose()
})

const handleResize = () => {
  myChart?.resize()
}

// type ChartRange = 'day' | 'week' | 'month'
// const chartTimeRange = ref<ChartRange>('week')
// const chartRef = ref<HTMLDivElement>()
// let myChart: echarts.ECharts | null = null
// const handleResize = () => myChart?.resize()

// // 2. 获取左侧 图表数据 (Supabase RPC 统计)
// const { xAxisData, yAxisData, fetchChartData } = useOrderChart()
// const renderChart = () => {
//   if (!myChart) return

//   const option = {
//     tooltip: {
//       trigger: 'axis',
//       axisPointer: { type: 'shadow' } // 鼠标悬浮时的阴影指示器
//     },
//     grid: {
//       top: '10%',
//       left: '3%',
//       right: '4%',
//       bottom: '3%',
//       containLabel: true
//     },
//     xAxis: {
//       type: 'category',
//       data: xAxisData.value, 
//       axisTick: { show: false }, // 去掉刻度线更高级
//       axisLine: { lineStyle: { color: '#e5e7eb' } } // 轴线颜色
//     },
//     yAxis: {
//       type: 'value',
//       splitLine: { lineStyle: { type: 'dashed', color: '#f3f4f6' } } // 虚线网格
//     },
//     series: [
//       {
//         name: '订单量',
//         type: 'bar',
//         barWidth: '40%', // 调整柱子宽度，不要太挤
//         data: yAxisData.value,
//         showBackground: true, // 开启你图中的灰色背景
//         backgroundStyle: {
//           color: 'rgba(180, 180, 180, 0.1)',
//           borderRadius: [4, 4, 0, 0]
//         },
//         itemStyle: {
//           color: '#5d5ce6', // 靠近你截图中的紫色调
//           borderRadius: [4, 4, 0, 0] // 顶部圆角
//         },
//         // 柱状图入场动画
//         animationDuration: 1000,
//         animationEasing: 'cubicOut'
//       }
//     ]
//   }

//   myChart.setOption(option)
// }

// // 4. 处理时间切换
// const handleTimeChange = async (val: ChartRange) => {
//   chartTimeRange.value = val
//   await fetchChartData(val) 
//   renderChart() // 数据变了，重新 setOption
// }

// onMounted(async () => {
//   // A. 先初始化 ECharts 实例
//   if (chartRef.value) {
//     myChart = echarts.init(chartRef.value)
//   }
  
//   // B. 获取数据并渲染
//   await fetchChartData(chartTimeRange.value)
//   renderChart()
//   // C. 监听窗口缩放
//   window.addEventListener('resize', handleResize)
// })

// // D. 别忘了组件销毁时清理资源，防止内存泄漏
// onUnmounted(() => {
//   window.removeEventListener('resize', handleResize)
//   myChart?.dispose()
// })
</script>

<style scoped>

</style>
