import request from '@/utils/request'

// 查询在线用户列表
export function server() {
  return request({
    url: '/monitor/server',
    method: 'get'
  })
}
