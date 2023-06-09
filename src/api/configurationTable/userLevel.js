import request from '@/utils/request'

// 增
export function listAdd (data) {
  return request({
    url: '/userLevel/create',
    method: 'post',
    data
  })
}

// 删
export function listDelete (data) {
  return request({
    url: '/userLevel/delete',
    method: 'post',
    data
  })
}

// 查
// 查询列表
export function listGet (query) {
  return request({
    url: '/userLevel/list',
    method: 'get',
    params: query
  })
}

// 通过id查询列表
export function idGet (query) {
  return request({
    url: '/userLevel/detail',
    method: 'get',
    params: query
  })
}

// 改
export function listedit (data) {
  return request({
    url: '/userLevel/update',
    method: 'post',
    data
  })
}

