import request from '@/utils/request'

// 增
export function listAdd (data) {
  return request({
    url: '/smmanage/add',
    method: 'post',
    data
  })
}

// 删
export function listDelete (data) {
  return request({
    url: '/smmanage/delect',
    method: 'post',
    data
  })
}

// 查
// 查询所有营销账号
export function listGet (query) {
  return request({
    url: '/smmanage/smlist',
    method: 'get',
    params: query
  })
}

// 查询所有未绑定的门店，找出符合条件的门店信息列表
// 通过门店账号或者门店名称，查询未绑定的门店列表，找出符合条件的门店信息列表
export function userGet (query) {
  return request({
    url: '/smmanage/unlist',
    method: 'get',
    params: query
  })
}

// 通过营销id或者营销账号查询绑定的门店信息。
export function idGet (query) {
  return request({
    url: '/smmanage/bdlist',
    method: 'get',
    params: query
  })
}

// 通过账号或名称，查‘营销账号信息’列表和账号或名称一致的营销账号信息
export function adminGet (name) {
  return request({
    url: '/smmanage/unlist',
    method: 'get',
    params: { name }
  })
}

// 改
export function listedit (data) {
  return request({
    url: '/smmanage/updata',
    method: 'post',
    data
  })
}

