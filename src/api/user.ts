import { getUserList, setUserList } from '@/utils/storage'
import axios from '@/axios.ts';
import { supabase } from '@/utils/supabase'
interface User {
  id: number;
  name: string;
  age: number;
  gender: string;
}

let userList: User[] = getUserList().length ? getUserList() : [
  { id: 1, name: '张三', age: 18, gender: '男' },
  { id: 2, name: '李四', age: 20, gender: '男' }
]

// 每次修改后保存到本地存储
const saveToStorage = () => {
  setUserList(userList)
}
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) {
    throw new Error(error.message)
  }
  return data
}
export const register = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  if (error) {
    throw new Error(error.message)
  }
  return data
}
export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })
  if (error) {
    throw new Error(error.message)
  }
  return data
}
// 获取用户列表
export const getUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...userList])
    }, 300)
  })
}

//添加用户
export const addUser = (user: User): Promise<boolean> => {
  return new Promise((resolve) => {
    userList.push({ ...user, id: Date.now() })
    saveToStorage()
    resolve(true)
  })
}

//编辑
export const editorUser = (user: User): Promise<boolean> => {
  return new Promise((resolve) => {
    userList = userList.map(item => {
      if (item.id === user.id) {
        return user
      }
      return item
    })
    saveToStorage()
    resolve(true)
  })
}

//删除
export const deleteUserApi = (id: number): Promise<boolean> => {
  return new Promise((resolve) => {
    userList = userList.filter(item => item.id !== id)
    saveToStorage()
    resolve(true)
  })
}

// export const login = (data: { username: string; password: string }) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (data.username === 'admin' && data.password === '123456') {
//         resolve({ token: 'mock-token-123' })
//       } else {
//         reject({ message: '用户名或密码错误' })
//       }
//     }, 300)
//   })
// }
// export const updatepassword = (data: { oldPassword: string; newPassword: string; rePassword: string }) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ success: true })
//     }, 500)
//   })
// }
// export const updatePassword = (data: { oldPassword: string; newPassword: string; rePassword: string }) => {
//   return axios.post("/admin/updatePassword", data)
// }