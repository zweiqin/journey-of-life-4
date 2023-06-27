import request from '@/utils/request'

export function getListData(params) {
	return request({
		url: '/dtsBrandInforms/selectComplaint',
		method: 'get',
		params
	})
}

export function complaintReview(data) {
	return request({
		url: '/dtsBrandInforms/handle',
		method: 'post',
		data
	})
}
