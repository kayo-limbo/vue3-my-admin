import { createStore } from 'vuex'
const store = createStore({
  state() {
    // 菜单列表
    return {
      user: {},
    }
  },

  mutations: {
    SET_USER(state: any, user: any) {
      state.user = user
    },
    RESET_START(state: any) {
      state.user = {}
    }
  }
})
export default store