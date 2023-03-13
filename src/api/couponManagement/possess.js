import request from '@/utils/request'

// 查
// 查询列表
export function listGet (query) {
  return request({
    url: '/hold/list',
    method: 'get',
    params: query
  })
}
