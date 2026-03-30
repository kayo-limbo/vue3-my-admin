export const getUserList = () => {
  const data = localStorage.getItem('userList')
  return data ? JSON.parse(data) : []
}

export const setUserList = (data: any) => {
  localStorage.setItem('userList', JSON.stringify(data))
}