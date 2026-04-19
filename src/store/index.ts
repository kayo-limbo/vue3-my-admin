/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore } from 'vuex'
import type { User } from '@supabase/supabase-js'

// 定义 State 类型，彻底避开类型推导错误
interface RootState {
  user: Partial<User> | Record<string, any>
  token: string
  asideWidth: string
  menus: any[]
  ruleNames: string[]
}

const store = createStore<RootState>({
  state() {
    return {
      user: {},
      token: localStorage.getItem('token') || '',
      asideWidth: '250px',
      menus: [],
      ruleNames: []
    }
  },

  mutations: {
    SET_TOKEN(state: RootState, token: string) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USERINFO(state: RootState, user: any) {
      state.user = user
    },
    RESET_STATE(state: RootState) {
      state.user = {}
      state.token = ''
      localStorage.removeItem('token')
    },
    handleAsideWidth(state: RootState) {
      state.asideWidth = state.asideWidth === '250px' ? '64px' : '250px'
    },
    SET_MENUS(state: RootState, menus: any[]) {
      state.menus = menus
    },
    SET_RULENAMES(state: RootState, ruleNames: string[]) {
      state.ruleNames = ruleNames
    }
  }
})

export default store
