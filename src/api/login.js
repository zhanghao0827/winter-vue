import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/login',  //登录请求
    method: 'post',
    data: {   //携带的json数据
      username,
      password
    }
  });
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 获取路由
export const getRoutes = () => {
  return request({
    url: '/getRoutes',
    method: 'get'
  })
}
