import request from '@/utils/request'

// 增
export function listAdd (data) {
  return request({
    url: '/brandLevel/create',
    method: 'post',
    data
  })
}

// 删
export function listDelete (data) {
  return request({
    url: '/brandLevel/delete',
    method: 'post',
    data
  })
}

// 查
// 查询列表
export function listGet (query) {
  return request({
    url: '/brandLevel/list',
    method: 'get',
    params: query
  })
}

// 改
export function listEdit (data) {
  return request({
    url: '/brandLevel/update',
    method: 'post',
    data
  })
}
