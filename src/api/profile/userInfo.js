import request from '@/utils/request'

// // 增
// export function listAdd (data) {
//   return request({
//     url: '/brokerageInfo/create',
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
export function UserInfoGet (query) {
  return request({
    url: '/personal/info',
    method: 'get',
    params: query
  })
}

// // 通过id查询列表
// export function idGet (query) {
//   return request({
//     url: '/brokerageInfo/detail',
//     method: 'get',
//     params: query
//   })
// }

// // 改
// export function listedit (data) {
//   return request({
//     url: '/brokerageInfo/update',
//     method: 'post',
//     data
//   })
// }

