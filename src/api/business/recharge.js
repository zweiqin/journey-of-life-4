import request from '@/utils/request'

export function listStore (query) {
  return request({
    url: '/brand/list',
    method: 'get',
    params: query
  })
}

export function listMember (query) {
  return request({
    url: '/buAccount/list',
    method: 'get',
    params: query
  })
}

export function memberRecharge (data) {
  return request({
    url: '/buAccount/topUp',
    method: 'post',
    data
  })
}
