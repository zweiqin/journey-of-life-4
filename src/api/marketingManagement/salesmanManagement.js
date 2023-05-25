import request from '@/utils/request'

// 根据营销或者门店系统账户名查询营销业务员ID或门店系统账户ID
export function idGet (username) {
  return request({
    url: '/salesman/introsp',
    method: 'get',
    params: { username }
  })
}

// 通过营销id或者营销账号查询绑定的门店信息。
export function listGet (query) {
  return request({
    url: '/sexclusive/bdlist',
    method: 'get',
    params: query
  })
}

// 删
export function listDelete (data) {
  return request({
    url: '/sexclusive/delect',
    method: 'post',
    data
  })
}

// 根据营销ID查询该营销账号下所有的门店信息
// export function listGet (id) {
//   return request({
//     url: '/sexclusive/bdlist',
//     method: 'get',
//     params: { id }
//   })
// }

// 根据营销ID和门店名称查询该营销账号下所有的门店信息
// export function salesmanListGet (salesmanid, name) {
//   return request({
//     url: '/sexclusive/brandlist',
//     method: 'get',
//     params: { salesmanid, name }
//   })
// }

// 根据门店业务员ID查询该门店下的会员信息
// export function memberListGet (id) {
//   return request({
//     url: '/sexclusive/userlist',
//     method: 'get',
//     params: { id }
//   })
// }
