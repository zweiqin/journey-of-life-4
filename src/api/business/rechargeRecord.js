import request from '@/utils/request'

export function listRechargeRecord (query) {
  return request({
    url: '/brandBalance/list',
    method: 'get',
    params: query
  })
}

export function memberRecharge (data) {
  return request({
    url: '/buAccount/recharge',
    method: 'post',
    data
  })
}
