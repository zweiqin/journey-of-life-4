import request3 from '@/utils/request3'
import request4 from '@/utils/request'

// export function getList (query) {
//   return request({
//     url: '/richText/list',
//     method: 'get',
//     params: query
//   })
// }

export function getListPost (data) {
  return request3({
    url: '',
    method: 'post',
    data
  })
}

export function getJiaJuListPost (data) {
  return request4({
    url: '',
    method: 'post',
    data
  })
}

