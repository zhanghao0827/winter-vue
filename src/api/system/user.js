import request from '@/utils/request'
import qs from 'qs'
import { isEmpty } from '@/utils/string'

// 查询用户列表
export function userList(params) {
  return request({
    url: '/system/user/list?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

// 添加用户
export function addUser(user) {
  return request({
    url: '/system/user',
    method: 'post',
    data: user
  })
}

// 修改用户
export function updateUser(user) {
  return request({
    url: '/system/user',
    method: 'put',
    data: user
  })
}

export function updateUserEnabled(id, enabled) {
  return request({
    url: '/system/user/enabled',
    method: 'put',
    data: {
      id,
      enabled
    }
  })
}

export function getUser(id) {
  return request({
    url: '/system/user/' + isEmpty(id),
    method: 'get'
  })
}

export function deleteUser(ids) {
  return request({
    url: '/system/user/' + ids,
    method: 'delete'
  })
}

export function updatePassword(data) {
  return request({
    url: '/system/user/password',
    method: 'put',
    data
  })
}

export function exportUser(params) {
  return request({
    url: '/system/user/export?' + qs.stringify(params, { indices: false }),
    method: 'get',
    responseType: 'blob'
  })
}

export function downLoadTemplate() {
  return request({
    url: '/system/user/template',
    method: 'get',
    responseType: 'blob'
  })
}
