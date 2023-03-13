import request from '@/utils/request'

export function listGetPicture (query) {
  return request({
    url: '/imgAlbum/list',
    method: 'get',
    params: query
  })
}

export function listDeletePicture (data) {
  return request({
    url: '/imgAlbum/delete',
    method: 'post',
    data
  })
}

export function listDetailPicture (id) {
  return request({
    url: '/imgAlbum/detail',
    method: 'get',
    params: { id }
  })
}

export function listeditPicture (data) {
  return request({
    url: '/imgAlbum/update',
    method: 'post',
    data
  })
}

export function publishPaintingsPicture (data) {
  return request({
    url: '/imgAlbum/create',
    method: 'post',
    data
  })
}
