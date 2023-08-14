import request from '@/utils/request'

// 增
export function listAdd (data) {
  return request({
    url: '/salesman/create',
    method: 'post',
    data
  })
}

// 删
export function listDelete (data) {
  return request({
    url: '/salesman/delete',
    method: 'post',
    data
  })
}

// 查
// 查询列表
export function listGet (query) {
  return request({
    url: '/salesman/smlist',
    method: 'get',
    params: query
  })
}

// 通过id查询列表
export function idGet (query) {
  return request({
    url: '/salesman/smlist',
    method: 'get',
    params: query
  })
}

// 查询未绑定的系统账户
export function listGetAdminId (query) {
  return request({
    url: '/admin/unBound',
    method: 'get',
    params: query
  })
}

// 改
export function listedit (data) {
  return request({
    url: '/salesman/update',
    method: 'post',
    data
  })
}

