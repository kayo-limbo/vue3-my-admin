
<template>
  <div>
    <h2>首页</h2>
    <div>
      <router-link to="/user">用户管理</router-link>
      <!-- <el-button @click="handleLogout">退出登录</el-button> -->
    </div>
  </div>
</template>
<script setup lang="ts">

// import { ElMessage } from 'element-plus'
// import { useRouter } from 'vue-router'
// import FHeader  from '@/layouts/components/FHeader.vue'
// import FMenu  from '@/layouts/components/FMenu.vue'
// import FTagList  from '@/layouts/components/FTagList.vue'

// const router = useRouter()

// const handleLogout = () => {
//   // 清除token
//   localStorage.removeItem('token')
//   router.replace('/login')
//   ElMessage.success('退出登录成功')
// }
</script>

<style scoped>
button {
  margin-left: 20px;
}
</style>
vue3 组件