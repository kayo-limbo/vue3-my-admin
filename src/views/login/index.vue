<template>
  <div>
    <h2>登录</h2>
    <el-form :model="form">
      <el-form-item>
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.password" placeholder="请输入密码" type="password" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="handleLogin">登录</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {ref} from 'vue'
import { login } from '@/api/user'
// import { setToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
const router = useRouter()
// const goHome = () => {
//   setToken()
//   router.push('/dashboard')
// }
const form = ref({
  username: '',
  password: '',
})
const handleLogin = async () => {
  try {
    const res:any = await login(form.value)
    localStorage.setItem('token', res.token)
   ElMessage.success('登录成功')
   router.push('/dashboard')
  }catch(err){
    ElMessage.error('登录失败')
  }
  }

</script>
<style scoped></style>
