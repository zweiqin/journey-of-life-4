import request from '@/utils/request'

export function listGet (query) {
  return request({
    url: '/brandSalesman/bidList',
    method: 'get',
    params: query
  })
}

// export function listDelete (data) {
//   return request({
//     url: '/pricesView/delete',
//     method: 'post',
//     data
//   })
// }

// export function listAdd (data) {
//   return request({
//     url: '/pricesView/add',
//     method: 'post',
//     data
//   })
// }

// export function listUpdate (data) {
//   return request({
//     url: '/pricesView/update',
//     method: 'post',
//     data
//   })
// }

