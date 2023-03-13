import request from '@/utils/request'

// // 增
// export function listAdd (data) {
//   return request({
//     url: '/userup/save',
//     method: 'post',
//     data
//   })
// }

// // 删
// export function listDelete (data) {
//   return request({
//     url: '/brokerageInfo/delete',
//     method: 'post',
//     data
//   })
// }

// // 查询列表
// export function listGet (url, data) {
//   return request({
//     url: url,
//     method: 'post',
//     data: data
//   })
// }

// 查询列表
export function listGet (data, page) {
  return request({
    url: '/upRecord/list?page=' + page + '&limit=20',
    method: 'post',
    data: data
  })
}

// 通过id查询列表
export function idGet (data) {
  return request({
    url: '/userup/list',
    method: 'post',
    data: data
  })
}

// // 注册
// export function signin (url, data) {
//   return request({
//     url: url,
//     method: 'get',
//     data
//   })
// }

// 注册业务员
export function signin (data) {
  return request({
    url: 'userup/signin',
    method: 'post',
    data: data
  })
}

// 升级vip
export function vipUp (data) {
  return request({
    url: '/userup/userUpVip',
    method: 'post',
    data: data
  })
}
