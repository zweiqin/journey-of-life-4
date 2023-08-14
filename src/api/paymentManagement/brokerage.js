import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/brokerage/list',
    method: 'get',
    params: query
  })
}

export function approveTrace(data) {
  return request({
    url: '/brokerage/approve',
    method: 'post',
    data
  })
}
