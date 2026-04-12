<template>
  <div class="f-tag-list" :style="{ left: store.state.asideWidth }">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      @tab-change="handleTabChange"
      @tab-remove="removeTab"
      style="min-width: 100px;"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        :closable="item.name !== '/dashboard'"
      >
      </el-tab-pane>
    </el-tabs>

    <span class="f-tag-down">
      <el-dropdown @command="handleCloseAction">
        <span class="el-dropdown-link">
          <el-icon><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="other">关闭其他</el-dropdown-item>
            <el-dropdown-item command="all">全部关闭</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import type { TabPaneName } from 'element-plus'

const store = useStore()
const router = useRouter()
const route = useRoute()

// 当前激活的 Tab
const editableTabsValue = ref(route.path)

// 标签页列表（通常初始包含一个首页）
const editableTabs = ref([
  { title: '主控台', name: '/dashboard' }
])

// 监听路由变化，动态增加标签
watch(() => route.path, (path) => {
  editableTabsValue.value = path
  const exist = editableTabs.value.find(item => item.name === path)
  if (!exist) {
    editableTabs.value.push({
      title: (route.meta.title as string) || '新标签页',
      name: path
    })
  }
}, { immediate: true })

// 切换标签页：点击 Tab 时跳转路由
const handleTabChange = (name: TabPaneName) => {
  router.push(name as string)
}

// 关闭标签页逻辑
const removeTab = (targetName: string) => {
  if (targetName === '/dashboard') return // 首页不允许关闭

  const tabs = editableTabs.value
  let activeName = editableTabsValue.value

  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
  router.push(activeName) // 关闭后跳转到新的激活页
}

// 下拉菜单逻辑：关闭其他 / 全部关闭
const handleCloseAction = (command: 'other' | 'all') => {
  if (command === 'other') {
    // 过滤掉非当前页且非首页的标签
    editableTabs.value = editableTabs.value.filter(
      tab => tab.name === editableTabsValue.value || tab.name === '/dashboard'
    )
  } else if (command === 'all') {
    // 只保留首页
    editableTabs.value = [{ title: '主控台', name: '/dashboard' }]
    editableTabsValue.value = '/dashboard'
    router.push('/dashboard')
  }
}

</script>

<style scoped>
.f-tag-list {
  position: fixed;
  top: 70px;
  right: 0;
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 44px;
  z-index: 100;
  background-color: #f3f4f6; /* 改为浅灰色背景，更接近生产环境 */
}

/* 穿透修改 Element Plus 默认样式 */
:deep(.el-tabs) {
  --el-tabs-header-height: 32px;
  border: none;
  flex: 1;
  min-width: 0;
}

:deep(.el-tabs__header) {
  border: none !important;
  margin: 0 !important;
}

:deep(.el-tabs__nav-wrap:after) {
  display: none !important;
}

:deep(.el-tabs__nav) {
  border: none !important;
}

:deep(.el-tabs__item) {
  background-color: #fff;
  margin: 0 4px;
  height: 32px;
  line-height: 32px;
  border: none !important;
  border-radius: 4px; /* 圆角效果 */
  font-size: 13px;
  color: #6b778c;
}

:deep(.el-tabs__item.is-active) {
  color: #409eff; /* 激活时的文字颜色 */
  background-color: #fff;
}

/* 隐藏 el-tabs 默认的内容区域，因为我们通常在外面用 router-view */
:deep(.el-tabs__content) {
  display: none;
}

.f-tag-down {
  margin-left: auto;
  background-color: #fff;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
.f-tag-list {
  position: fixed;
  top: 64px; /* 如果还是重合，请增加到 65px 或检查 Header 高度 */
  right: 0;
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 44px;
  z-index: 99; /* 确保低于 Header 但高于内容区 */
  background-color: #f3f4f6; /* 改成浅灰色，不要用深灰 */
}

/* 移除 Tab 底部自带的灰色线条，让它更干净 */


/* 激活状态下 Tab1 也会有蓝色文字反应 */
:deep(.el-tabs__item.is-active) {
  background-color: #fff;
  color: #409eff;
}
