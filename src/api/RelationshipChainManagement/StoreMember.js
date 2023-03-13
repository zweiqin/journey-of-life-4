import request from '@/utils/request'

// 增
export function listAdd (data) {
  return request({
    url: '/bduser/add',
    method: 'post',
    data
  })
}

// 删
export function listDelete (data) {
  return request({
    url: '/bduser/delect',
    method: 'post',
    data
  })
}

// 查
// 查询绑定列表所有信息
export function listGet (query) {
  return request({
    url: '/salesman/brandlist',
    method: 'get',
    params: query
  })
}

// 查询未绑定会员
export function idGet (name) {
  return request({
    url: '/bduser/unlist',
    method: 'get',
    params: name
  })
}

// 门店id或者门店账号查询绑定的会员信息
export function adminGet (data) {
  return request({
    url: '/salesman/userlist',
    method: 'get',
    params: data
  })
}

// 过账号或名称，查‘门店账号信息’列表和账号或名称一致的门店账号信息
export function listGetName (name) {
  return request({
    url: '/salesman/brandlist',
    method: 'get',
    params: { name }
  })
}

// 通过会员账号或者会员名称，查询未绑定的会员列表，找出符合条件的会员信息列表
export function getUser (name) {
  return request({
    url: '/salesman/userlist',
    method: 'get',
    params: { name }
  })
}

// 改
export function listedit (data) {
  return request({
    url: '/bduser/updata',
    method: 'post',
    data
  })
}

