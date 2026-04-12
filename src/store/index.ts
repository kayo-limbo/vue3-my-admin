import { createStore } from 'vuex'
const store = createStore({
  state() {
    // 菜单列表
    return {
      user: {},
      token: localStorage.getItem('token') || '',
      asideWidth: '250px',
      menus: [],
      ruleNames: []
    }
  },

  mutations: {
    SET_TOKEN(state: any, token: string) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USERINFO(state: any, user: any) {
      state.user = user
    },
    RESET_STATE(state: any) {
      state.user = {}
      state.token = ''
      localStorage.removeItem('token')
    },
    handleAsideWidth(state: any) {
      state.asideWidth = state.asideWidth === '250px' ? '64px' : '250px'
    },
    SET_MENUS(state: any, menus: any) {
      state.menus = menus
    },
    SET_RULENAMES(state: any, ruleNames: any) {
      state.ruleNames = ruleNames
    }
  }
})
export default store
