import Cookies from 'js-cookie'

const TokenKey = 'winter_vue_token'

// 使用Cookie存储,获取,删除token
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
