import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";
import { updatepassword } from "@/api/user";

export const usehanlelogout = () => {
  const store = useStore();
  const router = useRouter();
  const handleLogout = () => {
    store.commit('RESET_STATE')
    localStorage.clear()
    sessionStorage.clear()

    // localStorage.removeItem('token')
    router.replace('/login')
    ElMessage.success('退出登录成功')
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
        updatepassword(form).then((res: any) => {
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
