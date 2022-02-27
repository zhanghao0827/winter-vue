import request from '@/utils/request'
import qs from 'qs'

// 查询日志列表
export function logList(params) {
  return request({
    url: '/monitor/log/list?' + qs.stringify(params),
    method: 'get'
  })
}

// 删除日志
export function deleteLog(ids) {
  return request({
    url: '/monitor/log/' + ids,
    method: 'delete'
  })
}

// 导出日志
export function exportLog(params) {
  return request({
    url: '/monitor/log/export?' + qs.stringify(params, { indices: false }),
    method: 'get',
    responseType: 'blob'
  })
}
