import request from '@/utils/request'

// export function listArticle (query) {
//   return request({
//     url: '/tuanyou/querycompanyaccountamount',
//     method: 'get',
//     params: query
//   })
// }

export function querycompanyaccountamount(data) {
	return request({
		url: '/tuanyou/querycompanyaccountamount',
		method: 'post',
		data
	})
}

// 充值
export function changeoilcardamount(data) {
	return request({
		url: '/tuanyou/changeoilcardamount',
		method: 'post',
		data
	})
}

export function queryyoukalist(data) {
	return request({
		url: '/tuanyou/queryyoukalist',
		method: 'post',
		data
	})
}

