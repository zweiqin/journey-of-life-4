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

// 查
// 查询列表
export function listGet (url, data) {
  return request({
    url: url,
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

// // 改
// export function listedit (data) {
//   return request({
//     url: '/userup/manage',
//     method: 'post',
//     data
//   })
// }

