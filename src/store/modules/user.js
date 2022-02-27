import { getInfo, getRoutes, login, logout } from '@/api/login'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { constantRoutes, resetRouter } from '@/router'
import Layout from '@/layout/index'

const getDefaultState = () => {
  // 状态数据（页面刷新后，状态数据会被重置）
  return {
    token: getToken(), //Cookie存储的token保存到vue store中
    name: '',          //用户名
    avatar: '',        //用户头像
    routes: [],         //用户的路由，即菜单
    roles: [],
    permissions: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // 登录
  Login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      //调用 login.js中的login方法，传入username和password，获取响应数据
      login(username.trim(), password).then(res => {
        //token存储到cookie
        setToken(res.data.token)
        //token保存到状态管理对象
        commit('SET_TOKEN', res.data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  Logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(res => {
        removeToken() // must remove  token  first
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('SET_ROLES', [])
        commit('SET_ROUTES', [])
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户信息
  GetInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {
        const user = res.data.user
        const avatar = user.avatar === undefined || user.avatar === '' ? require('@/assets/avatar/akari.jpg') : user.avatar
        commit('SET_NAME', user.username)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES', res.data.roles)
        commit('SET_PERMISSIONS', res.data.permissions)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  GenerateRoutes({ commit }) {
    return new Promise(resolve => {
      // 向后端请求路由数据
      getRoutes().then(res => {
        const accessedRoutes = filterAsyncRouter(res.data)
        // 404 page must be placed at the end !!!
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', constantRoutes.concat(accessedRoutes))
        resolve(accessedRoutes)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // 前端 登出
  FedLogOut({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}




