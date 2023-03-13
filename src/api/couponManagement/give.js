import request from '@/utils/request'

// 查
// 查询列表
export function listGet (query) {
  return request({
    url: '/circula/list',
    method: 'get',
    params: query
  })
}

// 改
// 转增
export function transfer (data) {
  return request({
    url: '/circula/circula',
    method: 'post',
    data
  })
}
