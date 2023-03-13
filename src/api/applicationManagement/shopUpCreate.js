import request from '@/utils/request'

// 后台申请信息保存或提交（普通或高级）
export function listAdd (isSubmit, data) {
  return request({
    url: '/userup/save',
    method: 'post',
    params: { isSubmit },
    data
  })
}

// 会员列表
export function memberListGet (query) {
  return request({
    url: '/user/upList',
    method: 'get',
    params: query
  })
}

// 后台查询保存的会员申请（普通或高级）信息
export function InfoGet (query) {
  return request({
    url: '/userup/read',
    method: 'get',
    params: query
  })
}
