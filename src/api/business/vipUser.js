import request from '@/utils/request'

export function fetchList(query) {
	return request({
		url: '/user/levelList',
		method: 'get',
		params: query
	})
}

export function approveAgency(data) {
	return request({
		url: '/user/approveAgency',
		method: 'post',
		data
	})
}

export function detailApprove(id) {
	return request({
		url: '/user/detailApprove',
		method: 'get',
		params: { id }
	})
}

