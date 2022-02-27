import request from '@/utils/request'
import qs from 'qs'

// 查询用户列表
export function menuList() {
  return request({
    url: '/system/menu/list',
    method: 'get'
  })
}

export function addMenu(menu) {
  return request({
    url: '/system/menu',
    method: 'post',
    data: menu
  })
}

export function getMenu(id) {
  return request({
    url: '/system/menu/' + id,
    method: 'get'
  })
}

export function treeselect() {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  })
}

export function updateMenu(menu) {
  return request({
    url: '/system/menu',
    method: 'put',
    data: menu
  })
}

export function deleteMenu(id) {
  return request({
    url: '/system/menu/' + id,
    method: 'delete'
  })
}
