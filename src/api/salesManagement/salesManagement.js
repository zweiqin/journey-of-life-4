import request from '@/utils/request'

export function listGet (query) {
  return request({
    url: '/brandSalesman/list',
    method: 'get',
    params: query
  })
}

export function userGet (query) {
  return request({
    url: '/user/query',
    method: 'get',
    params: query
  })
}

export function brandGet (query) {
  return request({
    url: '/brand/query',
    method: 'get',
    params: query
  })
}

export function listDelete (data) {
  return request({
    url: '/brandSalesman/delete',
    method: 'post',
    data
  })
}

export function listAdd (data) {
  return request({
    url: '/brandSalesman/create',
    method: 'post',
    data
  })
}

export function listUpdate (data) {
  return request({
    url: '/brandSalesman/update',
    method: 'post',
    data
  })
}

