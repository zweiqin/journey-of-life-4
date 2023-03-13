import request from '@/utils/request'

// 增
export function listAdd (data) {
  return request({
    url: '/signInConfig/add',
    method: 'post',
    data
  })
}

// 删
export function listDelete (data) {
  return request({
    url: '/signInConfig/delete',
    method: 'post',
    data
  })
}

// 查
// 查询列表
export function listGet (query) {
  return request({
    url: '/signInConfig/list',
    method: 'get',
    params: query
  })
}

// 改
export function listedit (data) {
  return request({
    url: '/signInConfig/update',
    method: 'post',
    data
  })
}
