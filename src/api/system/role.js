import request from '@/utils/request'
import qs from 'qs'
import { isEmpty } from '@/utils/string'

// 查询用户列表
export function roleList(params) {
  return request({
    url: '/system/role/list?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function getRole(id) {
  return request({
    url: '/system/role/' + isEmpty(id),
    method: 'get'
  })
}

// 添加角色
export function addRole(role) {
  return request({
    url: '/system/role',
    method: 'post',
    data: role
  })
}

// 更新用户
export function updateRole(role) {
  return request({
    url: '/system/role',
    method: 'put',
    data: role
  })
}

//批量删除
export function deleteRole(id) {
  return request({
    url: '/system/role/' + id,
    method: 'delete'
  })
}

export function exportRole(params) {
  return request({
    url: '/system/role/export?' + qs.stringify(params, { indices: false }),
    method: 'get',
    responseType: 'blob'
  })
}
