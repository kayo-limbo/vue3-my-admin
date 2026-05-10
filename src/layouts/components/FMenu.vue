<template>
  <div class="f-menu" :style="{ width: store.asideWidth }">
    <el-menu :unique-opened="true" :default-active="defaultActive" class="el-menu-vertical-demo" @select="handleSelect" :collapse="isCollapse" :collapse-transition="false">
      <template v-for="(item, index) in asideMenus" :key="index">
        <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
          <template #title>
            <el-icon v-if="item.icon">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="(item2, index2) in item.child" :key="index2" :index="item2.frontpath || ''">
            <el-icon v-if="item2.icon">
              <component :is="item2.icon"/>
            </el-icon>
            <span>{{ item2.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="item.frontpath || ''">
          <el-icon v-if="item.icon">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ElMenu, ElSubMenu, ElMenuItem } from 'element-plus'
import { onMounted, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { serverApi } from '@/utils/request'
import { useUserStore } from '@/store/index'

const store = useUserStore()
const route = useRoute()
const router = useRouter()
const defaultActive = ref(route.path)
const handleSelect = (index: string) => {
  if (index) {
    router.push(index)
  }
}
const asideMenus = computed(() => store.menus)
const isCollapse = computed(() => store.asideWidth === '64px')
const formatMenus = (list:any[]) => {
  const tree:any[] = []
  const map:any = {}
  list.forEach(item => {
   map[item.id] = {...item, child:[]}
  })
  list.forEach(item => {
    if(item.parent_id ){
      if(map[item.parent_id]){
        map[item.parent_id].child.push(map[item.id])
      }
    }else{
      tree.push(map[item.id])
    }
  })
  return tree
}
onMounted(async () => {
  try {
    const res = await serverApi.get('/api/menus')
    const data = (res as any).data ?? res
    const list = Array.isArray(data) ? data : []
    console.log('菜单数据拿到了', list)
    const treeData = formatMenus(list)
    store.menus = treeData
    console.log('已存入菜单', treeData)
  } catch (err) {
    console.error('获取菜单失败', err)
  }
})

</script>

<style lang="scss" scoped>
.f-menu {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-right: 1px solid #e6e6e6;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  overflow-x: hidden;
  transition: all 0.2s;
  margin: 0;
  padding: 0;
}

.el-menu-vertical-demo {
  width: 100%;
  height: 100%;
  background-color: #ffffff !important;
  border-right: none !important;

  .el-menu-item,
  .el-sub-menu__title {
    height: 50px;
    line-height: 50px;
    margin: 0 10px;
    border-radius: 8px;
    font-size: 14px;
    color: #606266;
    transition: all 0.3s ease;

    &:hover {
      background-color: #ecf5ff !important;
      color: #409eff !important;
    }

    &.is-active {
      background-color: #ecf5ff !important;
      color: #409eff !important;
      font-weight: 500;
    }
  }

  .el-sub-menu__title {
    &:hover {
      .el-sub-menu__icon-arrow {
        color: #409eff !important;
      }
    }
  }

  .el-menu-item {
    padding-left: 48px !important;

    &:hover {
      transform: translateX(4px);
    }
  }

  .el-sub-menu__title {
    padding-left: 20px !important;
  }

  .el-icon {
    margin-right: 12px;
    font-size: 16px;
  }

  .el-sub-menu .el-menu {
    background-color: #ffffff !important;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    .el-menu-item {
      margin: 0 10px 4px 10px;
      border-radius: 6px;
    }
  }
}

// 滚动条样式
.f-menu::-webkit-scrollbar {
  width: 6px;
}

.f-menu::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.f-menu::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;

  &:hover {
    background: #a8a8a8;
  }
}
</style>
