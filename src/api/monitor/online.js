import request from '@/utils/request'
import qs from 'qs'

// 查询在线用户列表
export function onlineList(params) {
  return request({
    url: '/monitor/online/list?' + qs.stringify(params),
    method: 'get'
  })
}

// 强退用户
export function deleteOnline(ids) {
  return request({
    url: '/monitor/online/' + ids,
    method: 'delete'
  })
}

export function exportOnline() {
  return request({
    url: '/monitor/online/export',
    method: 'get',
    responseType: 'blob'
  })
}
