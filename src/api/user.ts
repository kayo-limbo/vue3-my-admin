import { getUserList, setUserList } from '@/utils/storage'
import axios from 'axios';

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

export const login = (data: { username: string; password: string }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.username === 'admin' && data.password === '123456') {
        resolve({ token: 'mock-token-123' })
      } else {
        reject({ message: '用户名或密码错误' })
      }
    }, 300)
  })
}
export const updatepassword = (data: { oldPassword: string; newPassword: string; rePassword: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true })
    }, 500)
  })
}