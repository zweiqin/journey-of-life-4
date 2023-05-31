import request from '@/utils/request'

export function listGoods(query) {
	return request({
		url: '/integralGoods/list',
		method: 'get',
		params: query
	})
}

export function deleteGoods(data) {
	return request({
		url: '/integralGoods/delete',
		method: 'post',
		data
	})
}

export function publishGoods(data) {
	return request({
		url: '/integralGoods/create',
		method: 'post',
		data
	})
}

export function detailGoods(params) {
	return request({
		url: '/integralGoods/detail',
		method: 'get',
		params
	})
}

export function editGoods(data) {
	return request({
		url: '/integralGoods/update',
		method: 'post',
		data
	})
}
