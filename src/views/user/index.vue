<template>
  <div>
    <el-card>
      <!-- <div style="display: flex; justify-content: space-between; align-items: center;"> -->
    <h2>用户管理</h2>
    <el-button type="primary" @click="openAdd">新增用户</el-button>
   <el-table :data="userList" style="width: 100%">
  <el-table-column prop="id" label="ID" width="80" />
  <el-table-column prop="name" label="姓名" />
  <el-table-column prop="age" label="年龄" />
  <el-table-column label="性别">
    <template #default="scope">
      {{ scope.row.gender }}
    </template>
  </el-table-column>

  <el-table-column label="操作">
    <template #default="scope">
      <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
      <el-button size="small" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
    </template>
  </el-table-column>
</el-table>
    <!--表单 -->
    <!-- 弹窗 -->
<el-dialog v-model="showForm" :title="isEditor ? '编辑用户' : '新增用户'"  width="400px">

  <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
    
    <el-form-item label="姓名" prop="name">
      <el-input v-model="form.name" placeholder="请输入姓名" />
    </el-form-item>

    <el-form-item label="年龄" prop="age">
      <el-input-number v-model="form.age" :min="1" />
    </el-form-item>

    <el-form-item label="性别" prop="gender">
      <el-select v-model="form.gender" placeholder="请选择性别">
        <el-option label="男" value="男" />
        <el-option label="女" value="女" />
      </el-select>
    </el-form-item>

  </el-form>

  <template #footer>
    <el-button @click="showForm = false">取消</el-button>
    <el-button type="primary" @click="submitForm">确定</el-button>
  </template>

</el-dialog>
     
  </el-card>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getUserList, setUserList} from '@/utils/storage'
import { getUsers, deleteUserApi, editorUser, addUser } from '@/api/user'
const formRef = ref()
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'blur' }]
}
interface User{
  id: number,
  name: string,
  age: number,
  gender: string,
}
const userList = ref<User[]>(getUserList().length ? getUserList() : [
  {
    id: 1,
    name: '张三',
    age: 18,
    gender: '男',
  },
  {
    id: 2,
    name: '李四',
    age: 20,
    gender: '女',
  },
  {
    id: 3,
    name: '王五',
    age: 22,
    gender: '男',
  },
])
const showForm = ref(false)
const isEditor = ref(false)
const form = ref<User>({
  id: 0,
  name: '',
  age: 0,
  gender:''
})
async function deleteUser(id: number) {
  await deleteUserApi(id)
  userList.value=userList.value.filter(user=>user.id!==id)
  setUserList(userList.value)
  userList.value=await getUsers()
}
const editUser = (user: User) => {
  isEditor.value=true,
  showForm.value=true,
  form.value={...user}
}
const openAdd= () => {
  isEditor.value=false,
  showForm.value=true,
  form.value={
    id: 0,
    name: '',
    age: 0,
    gender:''
  }
}
 
const submitForm = async () => {
  // if(!form.value.name||!form.value.age||!form.value.gender){
  //   ElMessage.error('请填写完整信息')
  //   return
  // }
  // if(isEditor.value){
  //   await editorUser(form.value)
  // }else{
  //   await addUser(form.value)
  // }
  // userList.value = await getUsers()
  // showForm.value = false
  formRef.value.validate(async (valid: boolean) => {
    if(!valid) return
  if(isEditor.value){
    await editorUser(form.value)
  }else{
    await addUser(form.value)
  }
    userList.value = await getUsers()
    showForm.value = false
  })
}

onMounted(async () => {
  userList.value = await getUsers() 
})
</script>
<style scoped></style>