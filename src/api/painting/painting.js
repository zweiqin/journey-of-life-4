import request from '@/utils/request'

export function listGet (query) {
  return request({
    url: '/paintAlbum/list',
    method: 'get',
    params: query
  })
}

export function listDelete (data) {
  return request({
    url: '/paintAlbum/delete',
    method: 'post',
    data
  })
}

export function listDetail (id) {
  return request({
    url: '/paintAlbum/detail',
    method: 'get',
    params: { id }
  })
}

export function listedit (data) {
  return request({
    url: '/paintAlbum/update',
    method: 'post',
    data
  })
}

export function publishPaintings (data) {
  return request({
    url: '/paintAlbum/create',
    method: 'post',
    data
  })
}
