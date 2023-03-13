import request from '@/utils/request'

// 查
// 查询列表
export function listGet (query) {
  return request({
    url: '/voucher/list',
    method: 'get',
    params: query
  })
}

// 改
export function listEdit (data) {
  return request({
    url: '/voucher/update',
    method: 'post',
    data
  })
}
