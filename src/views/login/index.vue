<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <img src="@/assets/IMG_denglu1.jpg" alt="logo" class="login-logo" />
      </div>
      
      <div class="login-form-container">
        <el-form ref="formRef" :model="form" :rules="rules" size="large">
          <div class="form-header">
            <h1>欢迎回来</h1>
            <p>请登录您的账号</p>
          </div>
          
          <el-form-item prop="username">
            <el-input 
              v-model="form.username" 
              placeholder="请输入用户名" 
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input 
              v-model="form.password" 
              type="password" 
              placeholder="请输入密码" 
              show-password
              
            />
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              class="login-btn" 
              @click="handleLogin"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {ref} from 'vue'
import { login } from '@/api/user'
// import { setToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

const store = useStore()
const formRef = ref()
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
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
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const res: any = await login(form.value)
      localStorage.setItem('token', res.token)
      
      // 更新store中的用户信息
      store.commit('SET_USERINFO', {
        name: form.value.username,
        avatar: ''
      })
      
      ElMessage.success('登录成功')
      router.replace('/dashboard')
    } catch (err) {
      ElMessage.error('登录失败')
    }
  })
}

</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: #fcc6e7 */
  /* background-image: linear-gradient(135deg, #feb1e0 0%, #cab8c0 100%); */
}
.login-box {
  width: 900px;
  height: 500px;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.login-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.login-form-container {
  flex: 1;
  padding: 40px;
}
.form-header {
  text-align: center;
  margin-bottom: 20px;
}
.form-header h1 {
  font-size: 32px;
  letter-spacing: 3px;
  font-weight: normal;
  margin-bottom: 10px;
}
.form-header p {
  font-size: 14px;
}
.el-form-item {
  margin-bottom: 30px;
}

.login-btn {
  margin-top: 40px;
  width: 30%;
  height: 40px;
  border-radius: 20px;
  background-color: #57a3f3;
  color: #fff;
  border: none;
  margin: 20px auto;
  cursor: pointer;
  font-size: 15px;
}
.login-btn:hover {
  background-color: #4590e2;
  transform: scale(1.05);
  transition: all 0.3s ease-in-out;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border: none;
  cursor: pointer;
  opacity: 0.8;
}
</style>
