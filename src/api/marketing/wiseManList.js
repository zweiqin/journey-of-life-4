import request from '@/utils/request'

// 达人上传
export function talentUpload (data) {
  return request({
    url: '/talent/upload',
    method: 'post',
    data
  })
}

// 达人列表
export function talentList (params) {
  return request({
    url: '/talent/list',
    method: 'get',
    params
  })
}

// 达人详情
export function talentInfo (params) {
  return request({
    url: '/talent/info',
    method: 'get',
    params
  })
}

// 修改达人
export function talentUpdate (params) {
  return request({
    url: '/talent/update',
    method: 'get',
    params
  })
}

// // 删
// export function listDelete (data) {
//   return request({
//     url: '/talent/update',
//     method: 'post',
//     data
//   })
// }
