import request from '@/utils/request'

// 查
// 查询列表
export function listGet (query) {
  return request({
    url: '/voucherRecord/list',
    method: 'get',
    params: query
  })
}

// 改
// 手动发放代金券
export function grant (data) {
  return request({
    url: '/hold/add',
    method: 'post',
    data
  })
}
