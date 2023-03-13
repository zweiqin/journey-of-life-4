import request from '@/utils/request'

// // 根据门店ID（必填）、用户名和手机号查询该门店下的会员信息
// export function listGet (query) {
//   return request({
//     url: '/brands/userlist',
//     method: 'get',
//     params: query
//   })
// }

// 门店id或者门店账号查询绑定的会员信息
export function adminGet (data) {
  return request({
    url: '/brands/userlist',
    method: 'get',
    params: data
  })
}

// 删
export function listDelete (data) {
  return request({
    url: '/brands/delect',
    method: 'post',
    data
  })
}
